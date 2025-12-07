import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { Waypoint } from "../types/api";
import { MapPin, Plus, Trash2, Navigation } from "lucide-react";

interface MapComponentProps {
	waypoints?: Waypoint[];
	onWaypointsChange?: (waypoints: Waypoint[]) => void;
	gpxData?: string;
	editable?: boolean;
	className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
	waypoints = [],
	onWaypointsChange,
	gpxData,
	editable = false,
	className = "h-96",
}) => {
	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<maplibregl.Map | null>(null);
	const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);
	const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);

	useEffect(() => {
		if (!mapContainer.current) return;

		// Initialize map
		map.current = new maplibregl.Map({
			container: mapContainer.current,
			style: "https://demotiles.maplibre.org/style.json", // Free demo style
			center: [11.255, 47.26], // Center on Bavaria/Austria Alps
			zoom: 9,
		});

		map.current.addControl(new maplibregl.NavigationControl(), "top-right");

		map.current.on("load", () => {
			if (map.current) {
				initializeMapData();
			}
		});

		// Handle map clicks for adding waypoints
		if (editable) {
			map.current.on("click", (e) => {
				if (isAddingWaypoint && onWaypointsChange) {
					const newWaypoint: Waypoint = {
						id: `waypoint-${Date.now()}`,
						name: `Wegpunkt ${waypoints.length + 1}`,
						latitude: e.lngLat.lat,
						longitude: e.lngLat.lng,
						description: "",
					};
					onWaypointsChange([...waypoints, newWaypoint]);
					setIsAddingWaypoint(false);
				}
			});
		}

		return () => {
			if (map.current) {
				map.current.remove();
			}
		};
	}, []);

	useEffect(() => {
		if (map.current && map.current.isStyleLoaded()) {
			updateMapData();
		}
	}, [waypoints, gpxData]);

	const initializeMapData = () => {
		if (!map.current) return;

		// Add source for waypoints
		map.current.addSource("waypoints", {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: [],
			},
		});

		// Add layer for waypoints
		map.current.addLayer({
			id: "waypoint-points",
			type: "circle",
			source: "waypoints",
			paint: {
				"circle-radius": 8,
				"circle-color": "#3B82F6",
				"circle-stroke-color": "#FFFFFF",
				"circle-stroke-width": 2,
			},
		});

		// Add labels for waypoints
		map.current.addLayer({
			id: "waypoint-labels",
			type: "symbol",
			source: "waypoints",
			layout: {
				"text-field": ["get", "name"],
				"text-font": ["Open Sans Regular"],
				"text-offset": [0, 2],
				"text-anchor": "top",
				"text-size": 12,
			},
			paint: {
				"text-color": "#374151",
				"text-halo-color": "#FFFFFF",
				"text-halo-width": 1,
			},
		});

		// Add source for route line
		map.current.addSource("route", {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: [],
			},
		});

		// Add layer for route line
		map.current.addLayer({
			id: "route-line",
			type: "line",
			source: "route",
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint: {
				"line-color": "#EF4444",
				"line-width": 3,
				"line-opacity": 0.8,
			},
		});

		updateMapData();
	};

	const updateMapData = () => {
		if (!map.current || !map.current.getSource("waypoints")) return;

		// Update waypoints
		const waypointFeatures = waypoints.map((waypoint) => ({
			type: "Feature" as const,
			geometry: {
				type: "Point" as const,
				coordinates: [waypoint.longitude, waypoint.latitude],
			},
			properties: {
				id: waypoint.id,
				name: waypoint.name,
				description: waypoint.description,
			},
		}));

		(map.current.getSource("waypoints") as maplibregl.GeoJSONSource).setData({
			type: "FeatureCollection",
			features: waypointFeatures,
		});

		// Create route line if we have waypoints
		if (waypoints.length > 1) {
			const routeCoordinates = waypoints.map((wp) => [
				wp.longitude,
				wp.latitude,
			]);
			(map.current.getSource("route") as maplibregl.GeoJSONSource).setData({
				type: "FeatureCollection",
				features: [
					{
						type: "Feature",
						geometry: {
							type: "LineString",
							coordinates: routeCoordinates,
						},
						properties: {},
					},
				],
			});
		}

		// Fit map to waypoints
		if (waypoints.length > 0) {
			const bounds = new maplibregl.LngLatBounds();
			waypoints.forEach((wp) => bounds.extend([wp.longitude, wp.latitude]));
			map.current.fitBounds(bounds, { padding: 50 });
		}
	};

	const removeWaypoint = (waypointId: string) => {
		if (onWaypointsChange) {
			const updated = waypoints.filter((wp) => wp.id !== waypointId);
			onWaypointsChange(updated);
		}
	};

	const updateWaypoint = (waypointId: string, updates: Partial<Waypoint>) => {
		if (onWaypointsChange) {
			const updated = waypoints.map((wp) =>
				wp.id === waypointId ? { ...wp, ...updates } : wp
			);
			onWaypointsChange(updated);
		}
	};

	return (
		<div className="space-y-4">
			{/* Map Controls */}
			{editable && (
				<div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
					<button
						onClick={() => setIsAddingWaypoint(!isAddingWaypoint)}
						className={`flex items-center px-3 py-2 text-sm rounded-md ${
							isAddingWaypoint
								? "bg-blue-600 text-white"
								: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
						}`}
					>
						<Plus className="h-4 w-4 mr-2" />
						{isAddingWaypoint ? "Abbrechen" : "Wegpunkt hinzufügen"}
					</button>
					{isAddingWaypoint && (
						<span className="text-sm text-gray-600">
							<Navigation className="h-4 w-4 inline mr-1" />
							Klicken Sie auf die Karte, um einen Wegpunkt zu setzen
						</span>
					)}
				</div>
			)}

			{/* Map Container */}
			<div
				className={`relative rounded-lg overflow-hidden border border-gray-300 ${className}`}
			>
				<div ref={mapContainer} className="w-full h-full" />
			</div>

			{/* Waypoints List */}
			{editable && waypoints.length > 0 && (
				<div className="bg-white border border-gray-200 rounded-lg">
					<div className="px-4 py-3 border-b border-gray-200">
						<h4 className="text-sm font-medium text-gray-900">Wegpunkte</h4>
					</div>
					<div className="divide-y divide-gray-200">
						{waypoints.map((waypoint, index) => (
							<div key={waypoint.id} className="p-4">
								<div className="flex items-start justify-between">
									<div className="flex-1 min-w-0">
										<div className="flex items-center space-x-2 mb-2">
											<MapPin className="h-4 w-4 text-blue-600" />
											<span className="text-sm font-medium text-gray-900">
												Wegpunkt {index + 1}
											</span>
										</div>
										<input
											type="text"
											value={waypoint.name}
											onChange={(e) =>
												updateWaypoint(waypoint.id || "", {
													name: e.target.value,
												})
											}
											className="input-field text-sm mb-2"
											placeholder="Name des Wegpunkts"
										/>
										<input
											type="text"
											value={waypoint.description || ""}
											onChange={(e) =>
												updateWaypoint(waypoint.id || "", {
													description: e.target.value,
												})
											}
											className="input-field text-sm"
											placeholder="Beschreibung (optional)"
										/>
										<div className="mt-2 text-xs text-gray-500">
											{waypoint.latitude.toFixed(6)},{" "}
											{waypoint.longitude.toFixed(6)}
										</div>
									</div>
									<button
										onClick={() => removeWaypoint(waypoint.id || "")}
										className="ml-4 p-2 text-gray-400 hover:text-red-600"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default MapComponent;
