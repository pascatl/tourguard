import cron from "node-cron";
import { tourService } from "./tourService";
import { notificationService } from "./notificationService";

export function setupCheckoutMonitoring(): void {
	// Check for overdue tours every 30 minutes
	cron.schedule("*/30 * * * *", async () => {
		try {
			console.log("🕐 Checking for overdue tours...");

			const overdueTours = await tourService.getOverdueTours();

			for (const tour of overdueTours) {
				// Check if notification was already sent (by checking if status is already 'overdue')
				if (tour.status !== "overdue") {
					await tourService.markTourAsOverdue(tour.id);
					await notificationService.sendOverdueNotification(tour);

					console.log(
						`📱 Sent overdue notification for tour: ${tour.name} (${tour.id})`
					);
				}
			}

			if (overdueTours.length === 0) {
				console.log("✅ No overdue tours found");
			}
		} catch (error) {
			console.error("❌ Error in checkout monitoring:", error);
		}
	});

	console.log("⏰ Checkout monitoring cron job started (every 30 minutes)");
}
