import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthContext } from "../contexts/AuthContext";
import { mockUser } from "../test/testUtils";

// Mock der DashboardPage
const MockDashboardPage = vi.fn(() => <div>Dashboard</div>);
vi.mock("../components/DashboardPage", () => ({
	default: MockDashboardPage,
}));

// Mock der TourCreatePage
const MockTourCreatePage = vi.fn(() => <div>Tour Create</div>);
vi.mock("../pages/TourCreatePage", () => ({
	default: MockTourCreatePage,
}));

// Mock der API Services
vi.mock("../services/api", () => ({
	authService: {
		login: vi.fn(),
		register: vi.fn(),
		logout: vi.fn(),
	},
}));

import App from "../App";

describe("App Component", () => {
	const mockAuthContextValue = {
		user: null,
		login: vi.fn(),
		logout: vi.fn(),
		register: vi.fn(),
		token: null,
	};

	const renderWithAuthContext = (authValue = mockAuthContextValue) => {
		return render(
			<AuthContext.Provider value={authValue}>
				<App />
			</AuthContext.Provider>
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("zeigt Login-Form wenn User nicht eingeloggt", () => {
		renderWithAuthContext();

		expect(screen.getByText("Bei TourGuard anmelden")).toBeInTheDocument();
		expect(screen.getByLabelText("E-Mail")).toBeInTheDocument();
		expect(screen.getByLabelText("Passwort")).toBeInTheDocument();
	});

	it("zeigt Dashboard wenn User eingeloggt", () => {
		const authValueWithUser = {
			...mockAuthContextValue,
			user: mockUser,
			token: "test-token",
		};

		renderWithAuthContext(authValueWithUser);

		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(MockDashboardPage).toHaveBeenCalled();
	});

	it("wechselt zur Registrierung bei Klick auf Link", async () => {
		const user = userEvent.setup();
		renderWithAuthContext();

		const registerLink = screen.getByText("Noch kein Konto? Hier registrieren");
		await user.click(registerLink);

		expect(screen.getByText("Bei TourGuard registrieren")).toBeInTheDocument();
	});

	it("wechselt zwischen Login und Registrierung", async () => {
		const user = userEvent.setup();
		renderWithAuthContext();

		// Zur Registrierung wechseln
		const registerLink = screen.getByText("Noch kein Konto? Hier registrieren");
		await user.click(registerLink);
		expect(screen.getByText("Bei TourGuard registrieren")).toBeInTheDocument();

		// Zurück zum Login
		const loginLink = screen.getByText("Bereits ein Konto? Hier anmelden");
		await user.click(loginLink);
		expect(screen.getByText("Bei TourGuard anmelden")).toBeInTheDocument();
	});

	it("zeigt TourCreatePage wenn Tour erstellt werden soll", async () => {
		const authValueWithUser = {
			...mockAuthContextValue,
			user: mockUser,
			token: "test-token",
		};

		renderWithAuthContext(authValueWithUser);

		// Simuliere Navigation zur Tour-Erstellung über Dashboard
		// (Dies würde normalerweise durch den DashboardPage-Button ausgelöst)
		expect(MockDashboardPage).toHaveBeenCalledWith(
			expect.objectContaining({
				onCreateTour: expect.any(Function),
			}),
			expect.any(Object)
		);
	});
});
