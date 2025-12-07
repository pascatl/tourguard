import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userService } from "../services/userService";
import { ApiResponse } from "../types";

const router = Router();

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

// Register
router.post(
	"/register",
	[
		body("email").isEmail().withMessage("Valid email is required"),
		body("password")
			.isLength({ min: 6 })
			.withMessage("Password must be at least 6 characters"),
		body("name").notEmpty().withMessage("Name is required"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const { email, password, name, phone } = req.body;

			// Check if user already exists
			const existingUser = await userService.findByEmail(email);
			if (existingUser) {
				return res.status(409).json({
					success: false,
					error: "User with this email already exists",
				} as ApiResponse);
			}

			// Hash password
			const passwordHash = await bcrypt.hash(password, 12);

			// Create user
			const user = await userService.createUser({
				email,
				name,
				phone,
				passwordHash,
			});

			// Generate JWT token
			const token = jwt.sign(
				{ userId: user.id, email: user.email },
				process.env.JWT_SECRET || "fallback-secret",
				{ expiresIn: "7d" }
			);

			res.status(201).json({
				success: true,
				data: {
					user: {
						id: user.id,
						email: user.email,
						name: user.name,
						phone: user.phone,
					},
					token,
				},
				message: "User registered successfully",
			} as ApiResponse);
		} catch (error) {
			console.error("Registration error:", error);
			res.status(500).json({
				success: false,
				error: "Failed to register user",
			} as ApiResponse);
		}
	}
);

// Login
router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Valid email is required"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			// Find user
			const user = await userService.findByEmail(email);
			if (!user) {
				return res.status(401).json({
					success: false,
					error: "Invalid credentials",
				} as ApiResponse);
			}

			// Check password
			const isValidPassword = await bcrypt.compare(password, user.passwordHash);
			if (!isValidPassword) {
				return res.status(401).json({
					success: false,
					error: "Invalid credentials",
				} as ApiResponse);
			}

			// Generate JWT token
			const token = jwt.sign(
				{ userId: user.id, email: user.email },
				process.env.JWT_SECRET || "fallback-secret",
				{ expiresIn: "7d" }
			);

			res.json({
				success: true,
				data: {
					user: {
						id: user.id,
						email: user.email,
						name: user.name,
						phone: user.phone,
					},
					token,
				},
				message: "Login successful",
			} as ApiResponse);
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json({
				success: false,
				error: "Failed to login",
			} as ApiResponse);
		}
	}
);

// Get current user profile
router.get("/me", async (req: Request, res: Response) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				error: "Access token required",
			} as ApiResponse);
		}

		const token = authHeader.substring(7);
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "fallback-secret"
		) as any;

		const user = await userService.findById(decoded.userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				error: "User not found",
			} as ApiResponse);
		}

		res.json({
			success: true,
			data: {
				id: user.id,
				email: user.email,
				name: user.name,
				phone: user.phone,
			},
		} as ApiResponse);
	} catch (error) {
		res.status(401).json({
			success: false,
			error: "Invalid token",
		} as ApiResponse);
	}
});

export default router;
