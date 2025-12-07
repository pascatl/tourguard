import { Router } from "express";
import tourRoutes from "./tourRoutes";
import authRoutes from "./authRoutes";

export function setupRoutes(): Router {
	const router = Router();

	// API info endpoint
	router.get("/", (req, res) => {
		res.json({
			service: "TourGuard API",
			version: "1.0.0",
			description: "Bergtour Sicherheitssystem API",
			endpoints: {
				auth: "/api/auth/*",
				tours: "/api/tours/*",
				health: "/health",
			},
		});
	});

	// Mount route modules
	router.use("/auth", authRoutes);
	router.use("/tours", tourRoutes);

	return router;
}
