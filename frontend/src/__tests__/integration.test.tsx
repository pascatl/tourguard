import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { mockUser, mockTour } from "../test/testUtils";

// Mock der gesamten API
const mockApi = {
	authService: {
		login: vi.fn(),
		register: vi.fn(),
		logout: vi.fn(),
	},
	tourService: {
		getTours: vi.fn(),
		createTour: vi.fn(),
		updateTour: vi.fn(),
		deleteTour: vi.fn(),
	},
};

vi.mock("../services/api", () => mockApi);

describe("TourGuard Integration Tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});

	describe("Kompletter Benutzer-Workflow", () => {
		it("Registrierung → Login → Tour erstellen → Dashboard anzeigen", async () => {
			const user = userEvent.setup();

			// Mock API Responses
			mockApi.authService.register.mockResolvedValue({
				user: mockUser,
				token: "test-token",
			});
			mockApi.authService.login.mockResolvedValue({
				user: mockUser,
				token: "test-token",
			});
			mockApi.tourService.getTours.mockResolvedValue([]);
			mockApi.tourService.createTour.mockResolvedValue(mockTour);

			render(<App />);

			// 1. Registrierung
			expect(screen.getByText("Bei TourGuard anmelden")).toBeInTheDocument();

			const registerLink = screen.getByText(
				"Noch kein Konto? Hier registrieren"
			);
			await user.click(registerLink);

			expect(
				screen.getByText("Bei TourGuard registrieren")
			).toBeInTheDocument();

			await user.type(screen.getByLabelText("Name"), mockUser.name);
			await user.type(screen.getByLabelText("E-Mail"), mockUser.email);
			await user.type(screen.getByLabelText("Passwort"), "password123");

			const registerButton = screen.getByText("Registrieren");
			await user.click(registerButton);

			// 2. Nach erfolgreicher Registrierung sollte Dashboard erscheinen
			await waitFor(() => {
				expect(
					screen.getByText(`Willkommen zurück, ${mockUser.name}!`)
				).toBeInTheDocument();
			});

			// 3. Tour erstellen
			mockApi.tourService.getTours.mockResolvedValue([]); // Leere Liste für Dashboard

			const createTourButton = screen.getByText("Erste Tour erstellen");
			await user.click(createTourButton);

			// Prüfen dass Tour-Formular erscheint
			await waitFor(() => {
				expect(screen.getByLabelText("Tour Name *")).toBeInTheDocument();
			});

			// Tour-Daten eingeben
			await user.type(screen.getByLabelText("Tour Name *"), mockTour.name);
			await user.type(
				screen.getByLabelText("Startort *"),
				mockTour.startLocation
			);
			await user.type(screen.getByLabelText("Zielort *"), mockTour.endLocation);
			await user.type(screen.getByLabelText("Startzeit *"), "2025-12-08T10:00");
			await user.type(
				screen.getByLabelText("Erwartete Ankunft *"),
				"2025-12-08T16:00"
			);
			await user.type(
				screen.getByLabelText("Name der Notfallkontaktperson *"),
				mockTour.emergencyContact.name
			);
			await user.type(
				screen.getByLabelText("Telefonnummer *"),
				mockTour.emergencyContact.phone
			);

			const submitButton = screen.getByText("Tour erstellen");
			await user.click(submitButton);

			// 4. Nach Tour-Erstellung zurück zum Dashboard
			await waitFor(() => {
				expect(mockApi.tourService.createTour).toHaveBeenCalled();
			});

			// 5. Dashboard sollte neue Tour anzeigen
			mockApi.tourService.getTours.mockResolvedValue([mockTour]);

			// Prüfen dass Dashboard wieder angezeigt wird
			await waitFor(() => {
				expect(
					screen.getByText(`Willkommen zurück, ${mockUser.name}!`)
				).toBeInTheDocument();
			});
		});

		it("Login → Touren anzeigen → Logout", async () => {
			const user = userEvent.setup();

			// Mock API Responses
			mockApi.authService.login.mockResolvedValue({
				user: mockUser,
				token: "test-token",
			});
			mockApi.tourService.getTours.mockResolvedValue([mockTour]);

			render(<App />);

			// 1. Login
			await user.type(screen.getByLabelText("E-Mail"), mockUser.email);
			await user.type(screen.getByLabelText("Passwort"), "password123");

			const loginButton = screen.getByText("Anmelden");
			await user.click(loginButton);

			// 2. Dashboard mit Touren sollte erscheinen
			await waitFor(() => {
				expect(
					screen.getByText(`Willkommen zurück, ${mockUser.name}!`)
				).toBeInTheDocument();
				expect(screen.getByText(mockTour.name)).toBeInTheDocument();
			});

			// 3. Logout
			const logoutButton = screen.getByText("Abmelden");
			await user.click(logoutButton);

			// 4. Zurück zum Login
			await waitFor(() => {
				expect(screen.getByText("Bei TourGuard anmelden")).toBeInTheDocument();
			});
		});

		it("Fehlerbehandlung bei API-Fehlern", async () => {
			const user = userEvent.setup();

			// Mock Login Fehler
			mockApi.authService.login.mockRejectedValue(
				new Error("Ungültige Anmeldedaten")
			);

			render(<App />);

			// Versuch Login mit falschen Daten
			await user.type(screen.getByLabelText("E-Mail"), "wrong@email.com");
			await user.type(screen.getByLabelText("Passwort"), "wrongpassword");

			const loginButton = screen.getByText("Anmelden");
			await user.click(loginButton);

			// Fehler sollte angezeigt werden
			await waitFor(() => {
				expect(
					screen.getByText(
						"Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Eingaben."
					)
				).toBeInTheDocument();
			});

			// Login-Form sollte noch sichtbar sein
			expect(screen.getByText("Bei TourGuard anmelden")).toBeInTheDocument();
		});
	});

	describe("Tour-Management Workflow", () => {
		beforeEach(async () => {
			// Benutzer ist bereits eingeloggt für diese Tests
			mockApi.authService.login.mockResolvedValue({
				user: mockUser,
				token: "test-token",
			});
			mockApi.tourService.getTours.mockResolvedValue([mockTour]);
		});

		it("Tour-Liste aktualisiert sich nach Erstellung", async () => {
			const user = userEvent.setup();
			const newTour = { ...mockTour, id: 2, name: "Neue Tour" };

			render(<App />);

			// Login
			await user.type(screen.getByLabelText("E-Mail"), mockUser.email);
			await user.type(screen.getByLabelText("Passwort"), "password123");
			await user.click(screen.getByText("Anmelden"));

			await waitFor(() => {
				expect(screen.getByText(mockTour.name)).toBeInTheDocument();
			});

			// Tour erstellen
			mockApi.tourService.createTour.mockResolvedValue(newTour);
			mockApi.tourService.getTours.mockResolvedValue([mockTour, newTour]);

			const createButton = screen.getByText("Neue Tour erstellen");
			await user.click(createButton);

			// Formular ausfüllen (vereinfacht)
			await user.type(screen.getByLabelText("Tour Name *"), newTour.name);
			await user.type(screen.getByLabelText("Startort *"), "Start");
			await user.type(screen.getByLabelText("Zielort *"), "Ende");
			await user.type(screen.getByLabelText("Startzeit *"), "2025-12-08T10:00");
			await user.type(
				screen.getByLabelText("Erwartete Ankunft *"),
				"2025-12-08T16:00"
			);
			await user.type(
				screen.getByLabelText("Name der Notfallkontaktperson *"),
				"Contact"
			);
			await user.type(screen.getByLabelText("Telefonnummer *"), "+49123456789");

			await user.click(screen.getByText("Tour erstellen"));

			// Neue Tour sollte in der Liste erscheinen
			await waitFor(() => {
				expect(screen.getByText(newTour.name)).toBeInTheDocument();
			});
		});

		it("Zeigt leeren Zustand korrekt an", async () => {
			const user = userEvent.setup();
			mockApi.tourService.getTours.mockResolvedValue([]);

			render(<App />);

			// Login
			await user.type(screen.getByLabelText("E-Mail"), mockUser.email);
			await user.type(screen.getByLabelText("Passwort"), "password123");
			await user.click(screen.getByText("Anmelden"));

			// Leerer Zustand sollte angezeigt werden
			await waitFor(() => {
				expect(
					screen.getByText("🎒 Keine Touren gefunden")
				).toBeInTheDocument();
				expect(screen.getByText("Erste Tour erstellen")).toBeInTheDocument();
			});
		});
	});

	describe("Persistierung und Session Management", () => {
		it("behält Login-Status bei Seitenneuladung bei", async () => {
			// Simuliere existierendes Token im localStorage
			localStorage.setItem("authToken", "existing-token");

			mockApi.tourService.getTours.mockResolvedValue([mockTour]);

			render(<App />);

			// App sollte direkt das Dashboard zeigen (da Token vorhanden)
			await waitFor(() => {
				expect(
					screen.getByText(`Willkommen zurück, ${mockUser.name}!`)
				).toBeInTheDocument();
			});
		});

		it("leitet zur Anmeldung weiter wenn Token ungültig", async () => {
			// Ungültiges Token im localStorage
			localStorage.setItem("authToken", "invalid-token");

			mockApi.tourService.getTours.mockRejectedValue(new Error("Unauthorized"));

			render(<App />);

			// Sollte zur Anmeldung weiterleiten
			await waitFor(() => {
				expect(screen.getByText("Bei TourGuard anmelden")).toBeInTheDocument();
			});
		});
	});
});
