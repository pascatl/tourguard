import axios from "axios";
import { SMSNotification, Tour } from "../types";
import { db } from "../config/database";
import { v4 as uuidv4 } from "uuid";

export class NotificationService {
	private readonly smsApiKey = process.env.SMS_API_KEY;
	private readonly smsApiUrl = "https://api.example-sms-provider.com/send"; // Replace with actual SMS provider

	async sendOverdueNotification(tour: Tour): Promise<void> {
		const message = this.createOverdueMessage(tour);

		try {
			// Send SMS to emergency contact
			await this.sendSMS(tour.emergencyContact.phone, message, tour.id);

			console.log(`Overdue notification sent for tour ${tour.id}`);
		} catch (error) {
			console.error(
				`Failed to send overdue notification for tour ${tour.id}:`,
				error
			);
		}
	}

	async sendSMS(
		phoneNumber: string,
		message: string,
		tourId: string
	): Promise<SMSNotification> {
		const notification: SMSNotification = {
			id: uuidv4(),
			tourId,
			recipientPhone: phoneNumber,
			message,
			status: "pending",
			createdAt: new Date(),
		};

		try {
			// Store notification in database
			await db("sms_notifications").insert({
				id: notification.id,
				tour_id: notification.tourId,
				recipient_phone: notification.recipientPhone,
				message: notification.message,
				status: notification.status,
				created_at: notification.createdAt,
			});

			// Send SMS via external API
			if (this.smsApiKey && process.env.NODE_ENV === "production") {
				await this.sendViaSmsProvider(phoneNumber, message);
				notification.status = "sent";
				notification.sentAt = new Date();
			} else {
				// In development, just log the message
				console.log(`📱 SMS (dev mode): ${phoneNumber} - ${message}`);
				notification.status = "sent";
				notification.sentAt = new Date();
			}

			// Update notification status
			await db("sms_notifications").where({ id: notification.id }).update({
				status: notification.status,
				sent_at: notification.sentAt,
			});

			return notification;
		} catch (error) {
			notification.status = "failed";

			await db("sms_notifications")
				.where({ id: notification.id })
				.update({ status: "failed" });

			throw error;
		}
	}

	private async sendViaSmsProvider(
		phoneNumber: string,
		message: string
	): Promise<void> {
		if (!this.smsApiKey) {
			throw new Error("SMS API key not configured");
		}

		// Example SMS API call - replace with actual provider
		const response = await axios.post(this.smsApiUrl, {
			to: phoneNumber,
			message: message,
			apiKey: this.smsApiKey,
		});

		if (response.status !== 200) {
			throw new Error(`SMS API returned status ${response.status}`);
		}
	}

	private createOverdueMessage(tour: Tour): string {
		const overdueHours = this.calculateOverdueHours(tour.expectedEndTime);

		return `🚨 TOURGUARD ALERT 🚨
    
Tour "${tour.name}" ist ${overdueHours} Stunden überfällig.

Geplantes Ende: ${tour.expectedEndTime.toLocaleString("de-DE")}
Status: Check-in ✅ | Check-out ❌

Teilnehmer: ${tour.participants.map((p) => p.name).join(", ")}

Notfalldaten abrufen:
https://tourguard.app/emergency/${tour.id}

Bei Notfall: 112 anrufen!`;
	}

	private calculateOverdueHours(expectedEndTime: Date): number {
		const now = new Date();
		const diffMs = now.getTime() - expectedEndTime.getTime();
		return Math.round(diffMs / (1000 * 60 * 60 * 100)) / 100; // Hours with 2 decimal places
	}

	async testSMS(phoneNumber: string): Promise<boolean> {
		try {
			await this.sendSMS(
				phoneNumber,
				"TourGuard Test - SMS Service funktioniert!",
				"test"
			);
			return true;
		} catch (error) {
			console.error("SMS test failed:", error);
			return false;
		}
	}
}

export const notificationService = new NotificationService();
