import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TourCreatePage from "../pages/TourCreatePage";
import { mockTour } from "../test/testUtils";

// Mock der API Services
const mockTourService = {
	createTour: vi.fn(),
};

vi.mock("../services/api", () => ({
	tourService: mockTourService,
}));

describe("TourCreatePage", () => {
	const defaultProps = {
		onTourCreated: vi.fn(),
		onCancel: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("rendert alle Formularfelder", () => {
		render(<TourCreatePage {...defaultProps} />);

		expect(screen.getByLabelText("Tour Name *")).toBeInTheDocument();
		expect(screen.getByLabelText("Beschreibung")).toBeInTheDocument();
		expect(screen.getByLabelText("Startort *")).toBeInTheDocument();
		expect(screen.getByLabelText("Zielort *")).toBeInTheDocument();
		expect(screen.getByLabelText("Startzeit *")).toBeInTheDocument();
		expect(screen.getByLabelText("Erwartete Ankunft *")).toBeInTheDocument();
		expect(
			screen.getByLabelText("Name der Notfallkontaktperson *")
		).toBeInTheDocument();
		expect(screen.getByLabelText("Telefonnummer *")).toBeInTheDocument();
	});

	it("zeigt Validierungsfehler bei leeren Pflichtfeldern", async () => {
		const user = userEvent.setup();
		render(<TourCreatePage {...defaultProps} />);

		const submitButton = screen.getByText("Tour erstellen");
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("Tour Name ist erforderlich")
			).toBeInTheDocument();
			expect(screen.getByText("Startort ist erforderlich")).toBeInTheDocument();
			expect(screen.getByText("Zielort ist erforderlich")).toBeInTheDocument();
		});
	});

	it("aktualisiert Formularfelder bei Eingabe", async () => {
		const user = userEvent.setup();
		render(<TourCreatePage {...defaultProps} />);

		const nameInput = screen.getByLabelText("Tour Name *");
		await user.type(nameInput, "Test Tour");

		expect(nameInput).toHaveValue("Test Tour");
	});

	it("erstellt Tour erfolgreich bei gültigen Daten", async () => {
		const user = userEvent.setup();
		const createdTour = { ...mockTour, id: 1 };
		mockTourService.createTour.mockResolvedValue(createdTour);

		render(<TourCreatePage {...defaultProps} />);

		// Alle Pflichtfelder ausfüllen
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
			expect(mockTourService.createTour).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "Test Tour",
					startLocation: "München",
					endLocation: "Garmisch",
					emergencyContact: {
						name: "Max Mustermann",
						phone: "+49123456789",
					},
				})
			);
			expect(defaultProps.onTourCreated).toHaveBeenCalledWith(createdTour);
		});
	});

	it("behandelt Fehler beim Erstellen einer Tour", async () => {
		const user = userEvent.setup();
		const errorMessage = "Erstellung fehlgeschlagen";
		mockTourService.createTour.mockRejectedValue(new Error(errorMessage));

		render(<TourCreatePage {...defaultProps} />);

		// Alle Pflichtfelder ausfüllen
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
			expect(
				screen.getByText(
					"Fehler beim Erstellen der Tour. Bitte versuchen Sie es erneut."
				)
			).toBeInTheDocument();
		});

		expect(defaultProps.onTourCreated).not.toHaveBeenCalled();
	});

	it("ruft onCancel beim Klick auf Abbrechen", async () => {
		const user = userEvent.setup();
		render(<TourCreatePage {...defaultProps} />);

		const cancelButton = screen.getByText("Abbrechen");
		await user.click(cancelButton);

		expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
	});

	it("validiert Telefonnummer-Format", async () => {
		const user = userEvent.setup();
		render(<TourCreatePage {...defaultProps} />);

		const phoneInput = screen.getByLabelText("Telefonnummer *");
		await user.type(phoneInput, "invalid-phone");

		const submitButton = screen.getByText("Tour erstellen");
		await user.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("Gültige Telefonnummer erforderlich")
			).toBeInTheDocument();
		});
	});

	it("zeigt Loading-Zustand während der Erstellung", async () => {
		const user = userEvent.setup();
		// Mock eine langsame API-Antwort
		mockTourService.createTour.mockImplementation(
			() => new Promise((resolve) => setTimeout(resolve, 1000))
		);

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

		// Loading-Text sollte erscheinen
		expect(screen.getByText("Erstelle Tour...")).toBeInTheDocument();
		expect(submitButton).toBeDisabled();
	});
});
