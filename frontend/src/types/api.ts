export interface User {
	id: string;
	email: string;
	name: string;
}

export interface Tour {
	id: string;
	name: string;
	description?: string;
	startLocation: string;
	endLocation?: string;
	startTime: string;
	expectedEndTime: string;
	emergencyContact: {
		name: string;
		phone: string;
	};
	status: "planned" | "active" | "completed" | "overdue";
	createdAt: string;
	updatedAt: string;
	createdBy?: string;
	checkedIn?: boolean;
	checkedOut?: boolean;
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
