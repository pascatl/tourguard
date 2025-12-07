import cron from "node-cron";
import { tourService } from "./tourService";
import { notificationService } from "./notificationService";

export function setupCheckoutMonitoring(): void {
	// Run every 15 minutes to check for overdue tours
	cron.schedule("*/15 * * * *", async () => {
		try {
			console.log("🔍 Checking for overdue tours...");

			const overdueTours = await tourService.getOverdueTours();

			for (const tour of overdueTours) {
				// Only send notification if tour status is not already 'overdue'
				if (tour.status !== "overdue") {
					console.log(
						`⚠️ Tour ${tour.id} (${tour.name}) is overdue, sending notification...`
					);

					// Mark tour as overdue
					await tourService.markTourAsOverdue(tour.id);

					// Send notification to emergency contact
					await notificationService.sendOverdueNotification(tour);
				}
			}

			if (overdueTours.length === 0) {
				console.log("✅ No overdue tours found");
			} else {
				console.log(`📱 Processed ${overdueTours.length} overdue tours`);
			}
		} catch (error) {
			console.error("❌ Error checking for overdue tours:", error);
		}
	});

	console.log("⏰ Checkout monitoring service scheduled (every 15 minutes)");
}
