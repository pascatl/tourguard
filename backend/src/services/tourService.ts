import { db } from "../config/database";
import { Tour, TourStatus, ApiResponse } from "../types";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import { gpxService } from "./gpxService";
import { notificationService } from "./notificationService";

export class TourService {
	async createTour(tourData: Partial<Tour>): Promise<Tour> {
		const tour = {
			id: uuidv4(),
			...tourData,
			status: "planned" as TourStatus,
			checkedIn: false,
			checkedOut: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await db("tours").insert({
			id: tour.id,
			name: tour.name,
			description: tour.description,
			start_location: tour.startLocation,
			end_location: tour.endLocation,
			start_time: tour.startTime,
			expected_end_time: tour.expectedEndTime,
			status: tour.status,
			created_by: tour.createdBy,
			created_at: tour.createdAt,
			updated_at: tour.updatedAt,
			emergency_contact: JSON.stringify(tour.emergencyContact),
			route_data: JSON.stringify(tour.route || {}),
			equipment: JSON.stringify(tour.equipment || []),
			participants: JSON.stringify(tour.participants || []),
			checked_in: tour.checkedIn,
			checked_out: tour.checkedOut,
		});

		return tour as Tour;
	}

	async getTourById(id: string): Promise<Tour | null> {
		const tourData = await db("tours").where({ id }).first();
		if (!tourData) return null;

		return this.mapDbToTour(tourData);
	}

	async getUserTours(userId: string): Promise<Tour[]> {
		try {
			const toursData = await db("tours")
				.where({ created_by: userId })
				.orderBy("created_at", "desc");

			return toursData.map((tour) => this.mapDbToTour(tour));
		} catch (error) {
			console.error("Error getting user tours for userId:", userId, error);
			throw error;
		}
	}

	async updateTour(
		id: string,
		updateData: Partial<Tour>,
		userId: string
	): Promise<Tour | null> {
		const tour = await this.getTourById(id);
		if (!tour || tour.createdBy !== userId) return null;

		const updatedTour = {
			...tour,
			...updateData,
			updatedAt: new Date(),
		};

		await db("tours")
			.where({ id })
			.update({
				name: updatedTour.name,
				description: updatedTour.description,
				start_location: updatedTour.startLocation,
				end_location: updatedTour.endLocation,
				start_time: updatedTour.startTime,
				expected_end_time: updatedTour.expectedEndTime,
				status: updatedTour.status,
				updated_at: updatedTour.updatedAt,
				emergency_contact: JSON.stringify(updatedTour.emergencyContact),
				route_data: JSON.stringify(updatedTour.route),
				equipment: JSON.stringify(updatedTour.equipment),
				participants: JSON.stringify(updatedTour.participants),
			});

		return updatedTour;
	}

	async checkinTour(id: string, userId: string): Promise<Tour | null> {
		const tour = await this.getTourById(id);
		if (!tour || tour.createdBy !== userId) return null;

		const now = new Date();
		await db("tours").where({ id }).update({
			checked_in: true,
			checkin_time: now,
			status: "active",
			updated_at: now,
		});

		return this.getTourById(id);
	}

	async checkoutTour(id: string, userId: string): Promise<Tour | null> {
		const tour = await this.getTourById(id);
		if (!tour || tour.createdBy !== userId) return null;

		const now = new Date();
		await db("tours").where({ id }).update({
			checked_out: true,
			checkout_time: now,
			actual_end_time: now,
			status: "completed",
			updated_at: now,
		});

		return this.getTourById(id);
	}

	async uploadGpxFile(
		tourId: string,
		filePath: string,
		userId: string
	): Promise<any> {
		const tour = await this.getTourById(tourId);
		if (!tour || tour.createdBy !== userId) {
			throw new Error("Tour not found or unauthorized");
		}

		try {
			const gpxContent = fs.readFileSync(filePath, "utf8");
			const routeData = await gpxService.parseGpx(gpxContent);

			await db("tours")
				.where({ id: tourId })
				.update({
					route_data: JSON.stringify({
						...tour.route,
						...routeData,
						gpxData: gpxContent,
					}),
					updated_at: new Date(),
				});

			// Clean up uploaded file
			fs.unlinkSync(filePath);

			return routeData;
		} catch (error) {
			fs.unlinkSync(filePath); // Clean up on error
			throw error;
		}
	}

	async getEmergencyData(id: string): Promise<any> {
		const tour = await this.getTourById(id);
		if (!tour) return null;

		return {
			tourInfo: {
				id: tour.id,
				name: tour.name,
				description: tour.description,
				status: tour.status,
				startTime: tour.startTime,
				expectedEndTime: tour.expectedEndTime,
				checkedIn: tour.checkedIn,
				checkedOut: tour.checkedOut,
				checkinTime: tour.checkinTime,
				checkoutTime: tour.checkoutTime,
			},
			emergencyContact: tour.emergencyContact,
			route: tour.route,
			participants: tour.participants,
			equipment: tour.equipment,
		};
	}

	async deleteTour(id: string, userId: string): Promise<boolean> {
		const tour = await this.getTourById(id);
		if (!tour || tour.createdBy !== userId) return false;

		await db("tours").where({ id }).del();
		return true;
	}

	async getOverdueTours(): Promise<Tour[]> {
		const now = new Date();
		const toursData = await db("tours")
			.where("status", "!=", "completed")
			.where("checked_in", true)
			.where("checked_out", false)
			.where("expected_end_time", "<", now);

		return toursData.map((tour) => this.mapDbToTour(tour));
	}

	async markTourAsOverdue(tourId: string): Promise<void> {
		await db("tours").where({ id: tourId }).update({
			status: "overdue",
			updated_at: new Date(),
		});
	}

	private mapDbToTour(dbTour: any): Tour {
		try {
			console.log("Mapping DB tour:", JSON.stringify(dbTour, null, 2));

			const tour = {
				id: dbTour.id,
				name: dbTour.name,
				description: dbTour.description,
				startLocation: dbTour.start_location,
				endLocation: dbTour.end_location,
				startTime: dbTour.start_time,
				expectedEndTime: dbTour.expected_end_time,
				actualEndTime: dbTour.actual_end_time,
				status: dbTour.status,
				createdBy: dbTour.created_by,
				userId: dbTour.user_id || dbTour.created_by,
				createdAt: dbTour.created_at,
				updatedAt: dbTour.updated_at,
				emergencyContact: this.safeJsonParse(dbTour.emergency_contact, {}),
				route: this.safeJsonParse(dbTour.route_data, {}),
				equipment: this.safeJsonParse(dbTour.equipment, []),
				participants: this.safeJsonParse(dbTour.participants, []),
				checkedIn: dbTour.checked_in,
				checkedOut: dbTour.checked_out,
				checkinTime: dbTour.checkin_time,
				checkoutTime: dbTour.checkout_time,
			};

			console.log("Mapped tour:", JSON.stringify(tour, null, 2));
			return tour;
		} catch (error) {
			console.error("Error mapping DB tour to Tour object:", error);
			console.error("DB Tour data:", dbTour);
			throw error;
		}
	}

	private safeJsonParse(jsonString: any, defaultValue: any) {
		try {
			if (!jsonString) return defaultValue;
			if (typeof jsonString === "object") return jsonString;
			return JSON.parse(jsonString);
		} catch (error) {
			console.error("JSON parse error:", error, "for string:", jsonString);
			return defaultValue;
		}
	}
}

export const tourService = new TourService();
