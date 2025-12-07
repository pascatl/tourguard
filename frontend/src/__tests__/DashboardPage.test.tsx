import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "../components/DashboardPage";
import { mockUser, mockTour } from "../test/testUtils";

// Mock der API Services
const mockTourService = {
	getTours: vi.fn(),
	createTour: vi.fn(),
};

vi.mock("../services/api", () => ({
	tourService: mockTourService,
}));

describe("DashboardPage", () => {
	const defaultProps = {
		user: mockUser,
		onLogout: vi.fn(),
		onCreateTour: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockTourService.getTours.mockResolvedValue([]);
	});

	it("lädt und zeigt Touren-Statistiken", async () => {
		const tours = [
			{ ...mockTour, status: "planned" },
			{ ...mockTour, id: 2, status: "active" },
			{ ...mockTour, id: 3, status: "completed" },
		];
		mockTourService.getTours.mockResolvedValue(tours);

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(screen.getByText("3")).toBeInTheDocument(); // Total
			expect(screen.getByText("1")).toBeInTheDocument(); // Planned
			expect(screen.getByText("1")).toBeInTheDocument(); // Active
			expect(screen.getByText("1")).toBeInTheDocument(); // Completed
		});
	});

	it("zeigt leeren Zustand wenn keine Touren vorhanden", async () => {
		mockTourService.getTours.mockResolvedValue([]);

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(screen.getByText("🎒 Keine Touren gefunden")).toBeInTheDocument();
			expect(screen.getByText("Erste Tour erstellen")).toBeInTheDocument();
		});
	});

	it("behandelt Fehler beim Laden von Touren", async () => {
		const errorMessage = "Netzwerk Fehler";
		mockTourService.getTours.mockRejectedValue(new Error(errorMessage));

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(
				screen.getByText("Fehler beim Laden der Touren")
			).toBeInTheDocument();
			expect(screen.getByText("Erneut versuchen")).toBeInTheDocument();
		});
	});

	it('ruft onCreateTour beim Klick auf "Neue Tour erstellen"', async () => {
		const user = userEvent.setup();
		mockTourService.getTours.mockResolvedValue([]);

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(screen.getByText("🎒 Keine Touren gefunden")).toBeInTheDocument();
		});

		const createButton = screen.getByText("Erste Tour erstellen");
		await user.click(createButton);

		expect(defaultProps.onCreateTour).toHaveBeenCalledTimes(1);
	});

	it("zeigt Begrüßung mit Benutzername", () => {
		render(<DashboardPage {...defaultProps} />);

		expect(
			screen.getByText(`Willkommen zurück, ${mockUser.name}!`)
		).toBeInTheDocument();
	});

	it("ruft onLogout beim Klick auf Logout-Button", async () => {
		const user = userEvent.setup();

		render(<DashboardPage {...defaultProps} />);

		const logoutButton = screen.getByText("Abmelden");
		await user.click(logoutButton);

		expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
	});

	it("zeigt Tour-Details korrekt an", async () => {
		const tours = [mockTour];
		mockTourService.getTours.mockResolvedValue(tours);

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(screen.getByText(mockTour.name)).toBeInTheDocument();
			expect(screen.getByText(mockTour.startLocation)).toBeInTheDocument();
			expect(screen.getByText(mockTour.endLocation)).toBeInTheDocument();
		});
	});

	it("lädt Touren nach Fehler erneut", async () => {
		const user = userEvent.setup();

		// Erstes Laden schlägt fehl
		mockTourService.getTours.mockRejectedValueOnce(new Error("Fehler"));
		// Zweites Laden ist erfolgreich
		mockTourService.getTours.mockResolvedValueOnce([mockTour]);

		render(<DashboardPage {...defaultProps} />);

		await waitFor(() => {
			expect(
				screen.getByText("Fehler beim Laden der Touren")
			).toBeInTheDocument();
		});

		const retryButton = screen.getByText("Erneut versuchen");
		await user.click(retryButton);

		await waitFor(() => {
			expect(screen.getByText(mockTour.name)).toBeInTheDocument();
		});

		expect(mockTourService.getTours).toHaveBeenCalledTimes(2);
	});
});
