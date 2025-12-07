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
		const toursData = await db("tours")
			.where({ created_by: userId })
			.orderBy("created_at", "desc");

		return toursData.map((tour) => this.mapDbToTour(tour));
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
		return {
			id: dbTour.id,
			name: dbTour.name,
			description: dbTour.description,
			startTime: dbTour.start_time,
			expectedEndTime: dbTour.expected_end_time,
			actualEndTime: dbTour.actual_end_time,
			status: dbTour.status,
			createdBy: dbTour.created_by,
			createdAt: dbTour.created_at,
			updatedAt: dbTour.updated_at,
			emergencyContact: JSON.parse(dbTour.emergency_contact || "{}"),
			route: JSON.parse(dbTour.route_data || "{}"),
			equipment: JSON.parse(dbTour.equipment || "[]"),
			participants: JSON.parse(dbTour.participants || "[]"),
			checkedIn: dbTour.checked_in,
			checkedOut: dbTour.checked_out,
			checkinTime: dbTour.checkin_time,
			checkoutTime: dbTour.checkout_time,
		};
	}
}

export const tourService = new TourService();
