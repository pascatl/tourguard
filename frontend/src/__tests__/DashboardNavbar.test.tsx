import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardPage from "../components/DashboardPage";

// Mock der API Services
vi.mock("../services/api", () => ({
	tourService: {
		getTours: vi.fn(),
	},
}));

// Mock ToastService
vi.mock("../services/toastService", () => ({
	ToastService: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

import { tourService } from "../services/api";

describe("DashboardPage - Navbar Layout", () => {
	const defaultProps = {
		user: { name: "Test User", email: "test@test.com" },
		onLogout: vi.fn(),
		onCreateTour: vi.fn(),
		refreshTrigger: 0,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock empty tours list by default
		(tourService.getTours as any).mockResolvedValue([]);
	});

	it("sollte 'Neue Tour' Button in der Navbar anzeigen", async () => {
		render(<DashboardPage {...defaultProps} />);

		// Der Button sollte im Header zu finden sein
		const createTourButton = screen.getByRole("button", { name: /neue tour/i });
		expect(createTourButton).toBeInTheDocument();
	});

	it("sollte onCreateTour aufrufen wenn 'Neue Tour' Button geklickt wird", async () => {
		render(<DashboardPage {...defaultProps} />);

		const createTourButton = screen.getByRole("button", { name: /neue tour/i });
		fireEvent.click(createTourButton);

		expect(defaultProps.onCreateTour).toHaveBeenCalledTimes(1);
	});

	it("sollte 'Neue Tour' Button neben 'Abmelden' Button anzeigen", async () => {
		render(<DashboardPage {...defaultProps} />);

		const createTourButton = screen.getByRole("button", { name: /neue tour/i });
		const logoutButton = screen.getByRole("button", { name: /abmelden/i });

		expect(createTourButton).toBeInTheDocument();
		expect(logoutButton).toBeInTheDocument();

		// Beide Buttons sollten im selben Container-Element sein (navbar)
		const createTourParent = createTourButton.parentElement;
		const logoutParent = logoutButton.parentElement;
		expect(createTourParent).toBe(logoutParent);
	});

	it("sollte keine separate 'Tour Management' Sektion mehr anzeigen", async () => {
		render(<DashboardPage {...defaultProps} />);

		// Die alte "Tour Management" Überschrift sollte nicht mehr existieren
		expect(screen.queryByText("Tour Management")).not.toBeInTheDocument();
	});

	it("sollte Benutzername im Header anzeigen", async () => {
		render(<DashboardPage {...defaultProps} />);

		expect(
			screen.getByText(`Willkommen, ${defaultProps.user.name}`)
		).toBeInTheDocument();
	});

	it("sollte TourGuard Logo/Titel im Header anzeigen", async () => {
		render(<DashboardPage {...defaultProps} />);

		expect(screen.getByText("🏔️ TourGuard")).toBeInTheDocument();
	});
});
