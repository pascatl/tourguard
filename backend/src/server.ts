import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { setupDatabase } from "./config/database";
import { setupRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { setupCheckoutMonitoring } from "./services/monitoring";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		credentials: true,
	})
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "OK",
		timestamp: new Date().toISOString(),
		service: "TourGuard Backend",
	});
});

// API Routes
app.use("/api", setupRoutes());

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
	res.status(404).json({
		error: "Route not found",
		path: req.originalUrl,
	});
});

// Start server
async function startServer() {
	try {
		// Initialize database
		await setupDatabase();
		console.log("✅ Database connection established");

		// Start checkout monitoring service
		setupCheckoutMonitoring();
		console.log("✅ Checkout monitoring service started");

		// Start HTTP server
		app.listen(PORT, () => {
			console.log(`🚀 TourGuard Backend running on port ${PORT}`);
			console.log(`🏔️ Ready to secure your mountain adventures!`);
		});
	} catch (error) {
		console.error("❌ Failed to start server:", error);
		process.exit(1);
	}
}

// Graceful shutdown
process.on("SIGTERM", () => {
	console.log("🛑 SIGTERM received, shutting down gracefully...");
	process.exit(0);
});

process.on("SIGINT", () => {
	console.log("🛑 SIGINT received, shutting down gracefully...");
	process.exit(0);
});

startServer();
