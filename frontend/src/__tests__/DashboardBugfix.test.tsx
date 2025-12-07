import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock der API Services
vi.mock("../services/api", () => ({
	tourService: {
		getTours: vi.fn(),
		createTour: vi.fn(),
	},
	api: {
		get: vi.fn(),
		post: vi.fn(),
		interceptors: {
			request: { use: vi.fn() },
			response: { use: vi.fn() },
		},
	},
}));

// Mock ToastService
vi.mock("../services/toastService", () => ({
	ToastService: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warning: vi.fn(),
	},
}));

import DashboardPage from "../components/DashboardPage";
import { tourService } from "../services/api";

describe("Dashboard Tour Display Bug Tests", () => {
	const defaultProps = {
		user: { id: "1", name: "Test User", email: "test@test.com" },
		onLogout: vi.fn(),
		onCreateTour: vi.fn(),
		refreshTrigger: 0,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sollte Touren korrekt laden und anzeigen", async () => {
		const mockTours = [
			{
				id: "1",
				name: "Test Wanderung",
				status: "planned",
				startLocation: "München",
				endLocation: "Garmisch",
				emergencyContact: { name: "Contact 1", phone: "123" },
			},
		];

		// @ts-ignore - Mock setup
		tourService.getTours.mockResolvedValue(mockTours);

		render(<DashboardPage {...defaultProps} />);

		// Warte bis die Touren geladen sind
		await waitFor(() => {
			expect(screen.getByText("Test Wanderung")).toBeInTheDocument();
		});

		// Prüfe dass die API korrekt aufgerufen wurde
		expect(tourService.getTours).toHaveBeenCalledTimes(1);
	});

	it("sollte bei refreshTrigger-Änderung neu laden", async () => {
		const initialTours = [
			{
				id: "1",
				name: "Tour 1",
				status: "planned",
				startLocation: "Start",
				endLocation: "Ende",
				emergencyContact: { name: "Contact", phone: "123" },
			},
		];

		const updatedTours = [
			...initialTours,
			{
				id: "2",
				name: "Tour 2",
				status: "planned",
				startLocation: "Start2",
				endLocation: "Ende2",
				emergencyContact: { name: "Contact2", phone: "456" },
			},
		];

		// @ts-ignore - Mock setup
		tourService.getTours.mockResolvedValueOnce(initialTours);

		const { rerender } = render(<DashboardPage {...defaultProps} />);

		// Warte bis erste Touren geladen sind
		await waitFor(() => {
			expect(screen.getByText("Tour 1")).toBeInTheDocument();
		});

		// Mock für zweiten Call
		// @ts-ignore - Mock setup
		tourService.getTours.mockResolvedValueOnce(updatedTours);

		// Re-render mit neuem refreshTrigger
		rerender(<DashboardPage {...defaultProps} refreshTrigger={1} />);

		// Warte bis neue Touren geladen sind
		await waitFor(() => {
			expect(screen.getByText("Tour 2")).toBeInTheDocument();
		});

		// Prüfe dass API zweimal aufgerufen wurde
		expect(tourService.getTours).toHaveBeenCalledTimes(2);
	});

	it("sollte leeren Zustand korrekt anzeigen", async () => {
		// @ts-ignore - Mock setup
		tourService.getTours.mockResolvedValue([]);

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(screen.getByText(/keine touren/i)).toBeInTheDocument();
		});
	});

	it("sollte API-Fehler korrekt behandeln", async () => {
		// @ts-ignore - Mock setup
		tourService.getTours.mockRejectedValue(new Error("API Error"));

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(screen.getByText(/fehler/i)).toBeInTheDocument();
		});
	});

	it("sollte Loading-State korrekt anzeigen", () => {
		// @ts-ignore - Mock setup
		tourService.getTours.mockImplementation(() => new Promise(() => {})); // Never resolves

		render(<DashboardPage {...defaultProps} />);

		expect(screen.getByText(/lade touren/i)).toBeInTheDocument();
	});
});
