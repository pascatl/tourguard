import axios from "axios";
import { User, Tour } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({
	baseURL: API_URL,
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
		return response.data;
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
		return response.data;
	},

	async getProfile(): Promise<User> {
		const response = await api.get("/auth/profile");
		return response.data;
	},
};

export const tourService = {
	async getTours(): Promise<Tour[]> {
		const response = await api.get("/tours");
		return response.data;
	},

	async getTour(id: string): Promise<Tour> {
		const response = await api.get(`/tours/${id}`);
		return response.data;
	},

	async createTour(tourData: Partial<Tour>): Promise<Tour> {
		const response = await api.post("/tours", tourData);
		return response.data;
	},

	async updateTour(id: string, tourData: Partial<Tour>): Promise<Tour> {
		const response = await api.put(`/tours/${id}`, tourData);
		return response.data;
	},

	async deleteTour(id: string): Promise<void> {
		await api.delete(`/tours/${id}`);
	},

	async uploadGPX(tourId: string, file: File): Promise<Tour> {
		const formData = new FormData();
		formData.append("gpx", file);
		const response = await api.post(`/tours/${tourId}/gpx`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	async checkin(tourId: string): Promise<Tour> {
		const response = await api.post(`/tours/${tourId}/checkin`);
		return response.data;
	},

	async checkout(tourId: string): Promise<Tour> {
		const response = await api.post(`/tours/${tourId}/checkout`);
		return response.data;
	},
};
