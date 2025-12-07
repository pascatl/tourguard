import axios from "axios";
import { User, Tour } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({
	baseURL: `${API_URL}/api`,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("tourguard_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid - clear auth data
			localStorage.removeItem("tourguard_token");
			localStorage.removeItem("tourguard_user");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export const authService = {
	async login(
		email: string,
		password: string
	): Promise<{ user: User; token: string }> {
		const response = await api.post("/auth/login", { email, password });
		return response.data.data; // Backend gibt { success: true, data: { user, token } } zurück
	},

	async register(
		email: string,
		password: string,
		name: string
	): Promise<{ user: User; token: string }> {
		const response = await api.post("/auth/register", {
			email,
			password,
			name,
		});
		return response.data.data; // Backend gibt { success: true, data: { user, token } } zurück
	},

	async getProfile(): Promise<User> {
		const response = await api.get("/auth/profile");
		return response.data.data; // Backend gibt { success: true, data: user } zurück
	},
};

export const tourService = {
	async getTours(): Promise<Tour[]> {
		const response = await api.get("/tours");
		return response.data.data; // Backend gibt { success: true, data: tours } zurück
	},

	async getTour(id: string): Promise<Tour> {
		const response = await api.get(`/tours/${id}`);
		return response.data.data; // Backend gibt { success: true, data: tour } zurück
	},

	async createTour(tourData: Partial<Tour>): Promise<Tour> {
		const response = await api.post("/tours", tourData);
		return response.data.data; // Backend gibt { success: true, data: tour } zurück
	},

	async updateTour(id: string, tourData: Partial<Tour>): Promise<Tour> {
		const response = await api.put(`/tours/${id}`, tourData);
		return response.data.data; // Backend gibt { success: true, data: tour } zurück
	},

	async deleteTour(id: string): Promise<void> {
		await api.delete(`/tours/${id}`);
		// DELETE gibt normalerweise keinen Body zurück
	},

	async uploadGPX(tourId: string, file: File): Promise<Tour> {
		const formData = new FormData();
		formData.append("gpx", file);
		const response = await api.post(`/tours/${tourId}/gpx`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data; // Backend gibt { success: true, data: tour } zurück
	},

	async checkin(tourId: string): Promise<Tour> {
		const response = await api.post(`/tours/${tourId}/checkin`);
		return response.data.data; // Backend gibt { success: true, data: tour } zurück
	},

	async checkout(tourId: string): Promise<Tour> {
		const response = await api.post(`/tours/${tourId}/checkout`);
		return response.data.data; // Backend gibt { success: true, data: tour } zurück
	},
};
