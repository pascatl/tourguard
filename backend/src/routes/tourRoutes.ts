import { Router, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { tourService } from "../services/tourService";
import { auth } from "../middleware/auth";
import { ApiResponse } from "../types";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Validation middleware
const validateRequest = (req: Request, res: Response, next: any) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			error: "Validation failed",
			details: errors.array(),
		});
	}
	next();
};

// Create new tour
router.post(
	"/",
	auth,
	[
		body("name").notEmpty().withMessage("Tour name is required"),
		body("startTime").isISO8601().withMessage("Valid start time is required"),
		body("expectedEndTime")
			.isISO8601()
			.withMessage("Valid expected end time is required"),
		body("emergencyContact.name")
			.notEmpty()
			.withMessage("Emergency contact name is required"),
		body("emergencyContact.phone")
			.isMobilePhone("de-DE")
			.withMessage("Valid phone number is required"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const tour = await tourService.createTour({
				...req.body,
				createdBy: (req as any).userId,
			});

			res.status(201).json({
				success: true,
				data: tour,
				message: "Tour created successfully",
			} as ApiResponse);
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Failed to create tour",
			} as ApiResponse);
		}
	}
);

// Get tour by ID
router.get(
	"/:id",
	auth,
	[param("id").isUUID().withMessage("Valid tour ID is required")],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const tour = await tourService.getTourById(req.params.id);
			if (!tour) {
				return res.status(404).json({
					success: false,
					error: "Tour not found",
				} as ApiResponse);
			}

			res.json({
				success: true,
				data: tour,
			} as ApiResponse);
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Failed to fetch tour",
			} as ApiResponse);
		}
	}
);

// Get user tours
router.get("/", auth, async (req: Request, res: Response) => {
	try {
		const tours = await tourService.getUserTours((req as any).userId);
		res.json({
			success: true,
			data: tours,
		} as ApiResponse);
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to fetch tours",
		} as ApiResponse);
	}
});

// Update tour
router.put(
	"/:id",
	auth,
	[param("id").isUUID().withMessage("Valid tour ID is required")],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const tour = await tourService.updateTour(
				req.params.id,
				req.body,
				(req as any).userId
			);
			if (!tour) {
				return res.status(404).json({
					success: false,
					error: "Tour not found",
				} as ApiResponse);
			}

			res.json({
				success: true,
				data: tour,
				message: "Tour updated successfully",
			} as ApiResponse);
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Failed to update tour",
			} as ApiResponse);
		}
	}
);

// Check-in to tour
router.post(
	"/:id/checkin",
	auth,
	[param("id").isUUID().withMessage("Valid tour ID is required")],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const tour = await tourService.checkinTour(
				req.params.id,
				(req as any).userId
			);
			if (!tour) {
				return res.status(404).json({
					success: false,
					error: "Tour not found",
				} as ApiResponse);
			}

			res.json({
				success: true,
				data: tour,
				message: "Successfully checked in to tour",
			} as ApiResponse);
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Failed to check in",
			} as ApiResponse);
		}
	}
);

// Check-out from tour
router.post(
	"/:id/checkout",
	auth,
	[param("id").isUUID().withMessage("Valid tour ID is required")],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const tour = await tourService.checkoutTour(
				req.params.id,
				(req as any).userId
			);
			if (!tour) {
				return res.status(404).json({
					success: false,
					error: "Tour not found",
				} as ApiResponse);
			}

			res.json({
				success: true,
				data: tour,
				message: "Successfully checked out from tour",
			} as ApiResponse);
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Failed to check out",
			} as ApiResponse);
		}
	}
);

// Upload GPX file
router.post(
	"/:id/gpx",
	auth,
	upload.single("gpxFile"),
	[param("id").isUUID().withMessage("Valid tour ID is required")],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			if (!req.file) {
				return res.status(400).json({
					success: false,
					error: "GPX file is required",
				} as ApiResponse);
			}

			const result = await tourService.uploadGpxFile(
				req.params.id,
				req.file.path,
				(req as any).userId
			);

			res.json({
				success: true,
				data: result,
				message: "GPX file processed successfully",
			} as ApiResponse);
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Failed to process GPX file",
			} as ApiResponse);
		}
	}
);

// Get emergency data (public endpoint for emergency services)
router.get(
	"/:id/emergency",
	[param("id").isUUID().withMessage("Valid tour ID is required")],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const emergencyData = await tourService.getEmergencyData(req.params.id);
			if (!emergencyData) {
				return res.status(404).json({
					success: false,
					error: "Tour not found",
				} as ApiResponse);
			}

			res.json({
				success: true,
				data: emergencyData,
			} as ApiResponse);
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Failed to fetch emergency data",
			} as ApiResponse);
		}
	}
);

// Delete tour
router.delete(
	"/:id",
	auth,
	[param("id").isUUID().withMessage("Valid tour ID is required")],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const success = await tourService.deleteTour(
				req.params.id,
				(req as any).userId
			);
			if (!success) {
				return res.status(404).json({
					success: false,
					error: "Tour not found",
				} as ApiResponse);
			}

			res.json({
				success: true,
				message: "Tour deleted successfully",
			} as ApiResponse);
		} catch (error) {
			res.status(500).json({
				success: false,
				error: "Failed to delete tour",
			} as ApiResponse);
		}
	}
);

export default router;
