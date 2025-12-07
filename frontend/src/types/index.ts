export interface Tour {
	id: string;
	name: string;
	description?: string;
	startTime: string;
	expectedEndTime: string;
	actualEndTime?: string;
	status: TourStatus;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	emergencyContact: EmergencyContact;
	route: RouteData;
	equipment: EquipmentItem[];
	participants: Participant[];
	checkedIn: boolean;
	checkedOut: boolean;
	checkinTime?: string;
	checkoutTime?: string;
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
	estimatedArrivalTime?: string;
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
}

export interface Tour {
	id: string;
	name: string;
	description?: string;
	start_location: string;
	end_location?: string;
	planned_start_time: string;
	planned_end_time: string;
	emergency_contact_name: string;
	emergency_contact_phone: string;
	gpx_data?: string;
	waypoints?: Waypoint[];
	status: "planned" | "active" | "completed" | "overdue";
	created_at: string;
	updated_at: string;
}

export interface Waypoint {
	id?: string;
	name: string;
	latitude: number;
	longitude: number;
	description?: string;
}

export interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<boolean>;
	register: (email: string, password: string, name: string) => Promise<boolean>;
	logout: () => void;
	loading: boolean;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface CreateTourData {
	name: string;
	description?: string;
	startTime: string;
	expectedEndTime: string;
	emergencyContact: EmergencyContact;
	route?: Partial<RouteData>;
	equipment?: EquipmentItem[];
	participants?: Participant[];
}

export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	name: string;
	phone?: string;
}
