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
