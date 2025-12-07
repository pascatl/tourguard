export interface Tour {
	id: string;
	name: string;
	description?: string;
	startLocation: string;
	endLocation: string;
	startTime: Date;
	expectedEndTime: Date;
	actualEndTime?: Date;
	status: TourStatus;
	createdBy: string;
	userId?: string;
	createdAt: Date;
	updatedAt: Date;
	emergencyContact: EmergencyContact;
	route: RouteData;
	equipment: EquipmentItem[];
	participants: Participant[];
	checkedIn: boolean;
	checkedOut: boolean;
	checkinTime?: Date;
	checkoutTime?: Date;
}

export type TourStatus =
	| "planned"
	| "active"
	| "completed"
	| "overdue"
	| "emergency";

export interface EmergencyContact {
	name: string;
	phone: string;
	relationship: string;
	email?: string;
}

export interface RouteData {
	waypoints: Waypoint[];
	gpxData?: string;
	totalDistance?: number;
	estimatedDuration?: number;
	difficulty?: "easy" | "moderate" | "difficult" | "expert";
	description?: string;
}

export interface Waypoint {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	altitude?: number;
	type: "start" | "checkpoint" | "summit" | "end" | "emergency";
	description?: string;
	estimatedArrivalTime?: Date;
}

export interface EquipmentItem {
	id: string;
	name: string;
	category: EquipmentCategory;
	isEssential: boolean;
	description?: string;
	quantity?: number;
}

export type EquipmentCategory =
	| "clothing"
	| "safety"
	| "navigation"
	| "food"
	| "shelter"
	| "tools"
	| "medical"
	| "communication";

export interface Participant {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	emergencyContact: EmergencyContact;
	experience: ExperienceLevel;
	medicalNotes?: string;
	isGuide: boolean;
}

export type ExperienceLevel =
	| "beginner"
	| "intermediate"
	| "advanced"
	| "expert";

export interface User {
	id: string;
	email: string;
	name: string;
	phone?: string;
	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface SMSNotification {
	id: string;
	tourId: string;
	recipientPhone: string;
	message: string;
	status: "pending" | "sent" | "failed";
	sentAt?: Date;
	createdAt: Date;
}
