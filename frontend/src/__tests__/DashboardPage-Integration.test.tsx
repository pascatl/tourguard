import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "../components/DashboardPage";
import { mockUser } from "../test/testUtils";

// Mock der API Services
const mockTourService = {
	getTours: vi.fn(),
	createTour: vi.fn(),
};

vi.mock("../services/api", () => ({
	tourService: mockTourService,
}));

describe("DashboardPage - Tour Display Issues", () => {
	const defaultProps = {
		user: mockUser,
		onLogout: vi.fn(),
		onCreateTour: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sollte neu erstellte Touren im Dashboard anzeigen", async () => {
		// Simuliere API-Response mit echten Backend-Daten
		const backendTour = {
			id: "50763b57-726a-4b2d-a68e-e458259e6e9f",
			name: "Test Bergtour",
			description: "Meine erste Test-Tour",
			startLocation: "München",
			endLocation: "Garmisch",
			startTime: "2025-12-15T08:00:00.000Z",
			expectedEndTime: "2025-12-15T18:00:00.000Z",
			actualEndTime: null,
			status: "planned",
			createdBy: "379a7847-2a29-4d68-9945-703b3f0d135b",
			userId: "379a7847-2a29-4d68-9945-703b3f0d135b",
			createdAt: "2025-12-07T14:24:57.774Z",
			updatedAt: "2025-12-07T14:24:57.774Z",
			emergencyContact: {
				name: "Max Mustermann",
				phone: "01701234567",
			},
			route: {},
			equipment: [],
			participants: [],
			checkedIn: false,
			checkedOut: false,
			checkinTime: null,
			checkoutTime: null,
		};

		mockTourService.getTours.mockResolvedValue([backendTour]);

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(screen.getByText("Test Bergtour")).toBeInTheDocument();
			expect(screen.getByText("München")).toBeInTheDocument();
			expect(screen.getByText("Garmisch")).toBeInTheDocument();
		});

		// Überprüfe dass Statistiken korrekt berechnet werden
		expect(screen.getByText("1")).toBeInTheDocument(); // Total tours
	});

	it("sollte leeren Zustand zeigen wenn Backend null/undefined zurückgibt", async () => {
		// Test verschiedene "leere" Antworten vom Backend
		const testCases = [null, undefined, []];

		for (const response of testCases) {
			mockTourService.getTours.mockResolvedValue(response);

			const { unmount } = render(<DashboardPage {...defaultProps} />);

			await waitFor(() => {
				expect(
					screen.getByText("🎒 Keine Touren gefunden")
				).toBeInTheDocument();
			});

			unmount();
		}
	});

	it("sollte Daten neu laden wenn refreshTrigger sich ändert", async () => {
		const initialTours = [
			{
				id: "1",
				name: "Tour 1",
				status: "planned",
				startLocation: "München",
				endLocation: "Garmisch",
				emergencyContact: { name: "Contact 1", phone: "123" },
			},
		];

		const updatedTours = [
			...initialTours,
			{
				id: "2",
				name: "Tour 2",
				status: "planned",
				startLocation: "Berlin",
				endLocation: "Hamburg",
				emergencyContact: { name: "Contact 2", phone: "456" },
			},
		];

		mockTourService.getTours.mockResolvedValueOnce(initialTours);

		const { rerender } = render(
			<DashboardPage {...defaultProps} refreshTrigger={0} />
		);

		await waitFor(() => {
			expect(screen.getByText("Tour 1")).toBeInTheDocument();
		});

		// Mock neue Daten für nächsten API-Call
		mockTourService.getTours.mockResolvedValueOnce(updatedTours);

		// Re-render mit neuem refreshTrigger
		rerender(<DashboardPage {...defaultProps} refreshTrigger={1} />);

		await waitFor(() => {
			expect(screen.getByText("Tour 2")).toBeInTheDocument();
		});

		// Überprüfe dass API zweimal aufgerufen wurde
		expect(mockTourService.getTours).toHaveBeenCalledTimes(2);
	});

	it("sollte API-Fehler abfangen ohne zu crashen", async () => {
		mockTourService.getTours.mockRejectedValue(new Error("API Error"));

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(screen.getByText(/fehler/i)).toBeInTheDocument();
		});
	});
});
