import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
	userId?: string;
}

export const auth = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				error: "Access token required",
			});
		}

		const token = authHeader.substring(7);

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "fallback-secret"
		) as any;

		req.userId = decoded.userId;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			error: "Invalid token",
		});
	}
};
