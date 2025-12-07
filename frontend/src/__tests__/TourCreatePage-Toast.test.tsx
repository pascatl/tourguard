import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TourCreatePage from "../pages/TourCreatePage";

// Mock der API Services - Definition vor Import
vi.mock("../services/api", () => ({
	tourService: {
		createTour: vi.fn(),
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

// Importiere die gemockten Services
import { ToastService } from "../services/toastService";
import { tourService } from "../services/api";

// Typings für die Mocks
const mockTourService = tourService as any;

describe("TourCreatePage - Toast Notifications", () => {
	const defaultProps = {
		onTourCreated: vi.fn(),
		onCancel: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sollte Erfolgs-Toast zeigen wenn Tour erfolgreich erstellt wird", async () => {
		const user = userEvent.setup();
		const createdTour = {
			id: "123",
			name: "Erfolgreiche Testtour",
			status: "planned" as const,
			startLocation: "München",
			endLocation: "Garmisch",
			emergencyContact: { name: "Test Contact", phone: "123" },
		};

		mockTourService.createTour.mockResolvedValue(createdTour);

		render(<TourCreatePage {...defaultProps} />);

		// Formular ausfüllen
		await user.type(screen.getByLabelText("Tour Name *"), createdTour.name);
		await user.type(screen.getByLabelText("Startort *"), "München");
		await user.type(screen.getByLabelText("Zielort *"), "Garmisch");
		await user.type(screen.getByLabelText("Startzeit *"), "2025-12-08T10:00");
		await user.type(
			screen.getByLabelText("Erwartete Ankunft *"),
			"2025-12-08T16:00"
		);
		await user.type(
			screen.getByLabelText("Name der Notfallkontaktperson *"),
			"Max Mustermann"
		);
		await user.type(screen.getByLabelText("Telefonnummer *"), "+49123456789");

		const submitButton = screen.getByText("Tour erstellen");
		await user.click(submitButton);

		await waitFor(() => {
			expect(mockTourService.createTour).toHaveBeenCalledWith({
				name: createdTour.name,
				description: "",
				startLocation: "München",
				endLocation: "Garmisch",
				startTime: "2025-12-08T10:00",
				expectedEndTime: "2025-12-08T16:00",
				emergencyContact: {
					name: "Max Mustermann",
					phone: "+49123456789",
				},
			});

			expect(defaultProps.onTourCreated).toHaveBeenCalledWith(createdTour);

			// Prüfe dass Erfolgs-Toast angezeigt wird
			expect(ToastService.success).toHaveBeenCalledWith(
				`Tour "${createdTour.name}" wurde erfolgreich erstellt!`
			);
		});
	});

	it("sollte Fehler-Toast zeigen bei API-Fehlern", async () => {
		const user = userEvent.setup();

		mockTourService.createTour.mockRejectedValue(new Error("API Error"));

		render(<TourCreatePage {...defaultProps} />);

		// Formular ausfüllen
		await user.type(screen.getByLabelText("Tour Name *"), "Test Tour");
		await user.type(screen.getByLabelText("Startort *"), "München");
		await user.type(screen.getByLabelText("Zielort *"), "Garmisch");
		await user.type(screen.getByLabelText("Startzeit *"), "2025-12-08T10:00");
		await user.type(
			screen.getByLabelText("Erwartete Ankunft *"),
			"2025-12-08T16:00"
		);
		await user.type(
			screen.getByLabelText("Name der Notfallkontaktperson *"),
			"Max Mustermann"
		);
		await user.type(screen.getByLabelText("Telefonnummer *"), "+49123456789");

		const submitButton = screen.getByText("Tour erstellen");
		await user.click(submitButton);

		await waitFor(() => {
			expect(ToastService.error).toHaveBeenCalledWith(
				"Fehler beim Erstellen der Tour. Bitte versuchen Sie es erneut."
			);
		});

		expect(defaultProps.onTourCreated).not.toHaveBeenCalled();
	});

	it("sollte korrekte Tour-Daten an onTourCreated weitergeben", async () => {
		const user = userEvent.setup();
		const tourData = {
			id: "tour-123",
			name: "Meine Bergtour",
			description: "Eine schöne Tour",
			startLocation: "Berchtesgaden",
			endLocation: "Königssee",
		};

		mockTourService.createTour.mockResolvedValue(tourData);

		render(<TourCreatePage {...defaultProps} />);

		await user.type(screen.getByLabelText("Tour Name *"), tourData.name);
		await user.type(
			screen.getByLabelText("Beschreibung"),
			tourData.description
		);
		await user.type(
			screen.getByLabelText("Startort *"),
			tourData.startLocation
		);
		await user.type(screen.getByLabelText("Zielort *"), tourData.endLocation);
		await user.type(screen.getByLabelText("Startzeit *"), "2025-12-08T09:00");
		await user.type(
			screen.getByLabelText("Erwartete Ankunft *"),
			"2025-12-08T17:00"
		);
		await user.type(
			screen.getByLabelText("Name der Notfallkontaktperson *"),
			"Anna Müller"
		);
		await user.type(screen.getByLabelText("Telefonnummer *"), "+49987654321");

		await user.click(screen.getByText("Tour erstellen"));

		await waitFor(() => {
			expect(defaultProps.onTourCreated).toHaveBeenCalledWith(tourData);
		});

		// Verrifiziere dass das korrekte Objekt an die API gesendet wurde
		expect(mockTourService.createTour).toHaveBeenCalledWith({
			name: tourData.name,
			description: tourData.description,
			startLocation: tourData.startLocation,
			endLocation: tourData.endLocation,
			startTime: "2025-12-08T09:00",
			expectedEndTime: "2025-12-08T17:00",
			emergencyContact: {
				name: "Anna Müller",
				phone: "+49987654321",
			},
		});
	});
});
