import { Waypoint, RouteData } from "../types";

export class GpxService {
	async parseGpx(gpxContent: string): Promise<RouteData> {
		try {
			// Simplified GPX parsing - in production use a proper GPX parser
			const waypoints: Waypoint[] = [];

			// Extract waypoints using regex (basic implementation)
			const wptMatches = gpxContent.match(
				/<wpt[^>]*lat="([^"]*)"[^>]*lon="([^"]*)"[^>]*>(.*?)<\/wpt>/g
			);

			if (wptMatches) {
				wptMatches.forEach((wptMatch, index) => {
					const latMatch = wptMatch.match(/lat="([^"]*)"/);
					const lonMatch = wptMatch.match(/lon="([^"]*)"/);
					const nameMatch = wptMatch.match(/<name>(.*?)<\/name>/);

					if (latMatch && lonMatch) {
						waypoints.push({
							id: `wpt_${index}`,
							name: nameMatch ? nameMatch[1] : `Waypoint ${index + 1}`,
							latitude: parseFloat(latMatch[1]),
							longitude: parseFloat(lonMatch[1]),
							type:
								index === 0
									? "start"
									: index === wptMatches.length - 1
									? "end"
									: "checkpoint",
						});
					}
				});
			}

			// If no waypoints found, try to extract track points
			if (waypoints.length === 0) {
				const trkptMatches = gpxContent.match(
					/<trkpt[^>]*lat="([^"]*)"[^>]*lon="([^"]*)"[^>]*>/g
				);
				if (trkptMatches && trkptMatches.length > 0) {
					// Add start and end points from track
					const firstMatch = trkptMatches[0];
					const lastMatch = trkptMatches[trkptMatches.length - 1];

					const firstLat = firstMatch.match(/lat="([^"]*)"/);
					const firstLon = firstMatch.match(/lon="([^"]*)"/);
					const lastLat = lastMatch.match(/lat="([^"]*)"/);
					const lastLon = lastMatch.match(/lon="([^"]*)"/);

					if (firstLat && firstLon) {
						waypoints.push({
							id: "track_start",
							name: "Start",
							latitude: parseFloat(firstLat[1]),
							longitude: parseFloat(firstLon[1]),
							type: "start",
						});
					}

					if (lastLat && lastLon && trkptMatches.length > 1) {
						waypoints.push({
							id: "track_end",
							name: "End",
							latitude: parseFloat(lastLat[1]),
							longitude: parseFloat(lastLon[1]),
							type: "end",
						});
					}
				}
			}

			const totalDistance = this.calculateTotalDistance(waypoints);
			const estimatedDuration = this.estimateDuration(totalDistance, waypoints);

			return {
				waypoints,
				gpxData: gpxContent,
				totalDistance,
				estimatedDuration,
				description: "Imported GPX route",
			};
		} catch (error) {
			console.error("GPX parsing error:", error);
			throw new Error("Failed to parse GPX file");
		}
	}

	private calculateTotalDistance(waypoints: Waypoint[]): number {
		let totalDistance = 0;

		for (let i = 1; i < waypoints.length; i++) {
			const prevPoint = waypoints[i - 1];
			const currentPoint = waypoints[i];

			totalDistance += this.calculateDistance(
				prevPoint.latitude,
				prevPoint.longitude,
				currentPoint.latitude,
				currentPoint.longitude
			);
		}

		return totalDistance;
	}

	private calculateDistance(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	): number {
		// Haversine formula for calculating distance between two GPS coordinates
		const R = 6371; // Earth's radius in km
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	private estimateDuration(distance: number, waypoints: Waypoint[]): number {
		// Basic estimation: 4 km/h hiking speed plus elevation gain factor
		const baseSpeed = 4; // km/h
		let elevationGain = 0;

		// Calculate elevation gain if altitude data is available
		for (let i = 1; i < waypoints.length; i++) {
			const prevAlt = waypoints[i - 1].altitude || 0;
			const currentAlt = waypoints[i].altitude || 0;
			if (currentAlt > prevAlt) {
				elevationGain += currentAlt - prevAlt;
			}
		}

		// Add 1 hour for every 600m elevation gain (Naismith's rule approximation)
		const elevationTime = elevationGain / 600;
		const distanceTime = distance / baseSpeed;

		return Math.round((distanceTime + elevationTime) * 60); // Return in minutes
	}

	generateGpx(
		waypoints: Waypoint[],
		metadata?: { name?: string; description?: string }
	): string {
		const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TourGuard" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${metadata?.name || "TourGuard Route"}</name>
    <desc>${metadata?.description || "Route created with TourGuard"}</desc>
  </metadata>`;

		const waypointElements = waypoints
			.map(
				(wp) => `
  <wpt lat="${wp.latitude}" lon="${wp.longitude}">
    <name>${wp.name}</name>
    ${wp.altitude ? `<ele>${wp.altitude}</ele>` : ""}
    ${wp.description ? `<desc>${wp.description}</desc>` : ""}
    <type>${wp.type}</type>
  </wpt>`
			)
			.join("");

		const gpxFooter = "</gpx>";

		return gpxHeader + waypointElements + gpxFooter;
	}
}

export const gpxService = new GpxService();
