import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock vor allen Imports
vi.mock("../services/api", () => ({
	tourService: {
		createTour: vi.fn(),
	},
}));

vi.mock("../services/toastService", () => ({
	ToastService: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warning: vi.fn(),
	},
}));

import TourCreatePage from "../pages/TourCreatePage";
import { ToastService } from "../services/toastService";
import { tourService } from "../services/api";

describe("Toast Integration Tests", () => {
	const defaultProps = {
		onTourCreated: vi.fn(),
		onCancel: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sollte Erfolgs-Toast mit korrektem Namen zeigen", async () => {
		const user = userEvent.setup();
		const createdTour = {
			id: "123",
			name: "Meine Testtour",
			status: "planned" as const,
			startLocation: "Start",
			endLocation: "Ende",
			emergencyContact: { name: "Test", phone: "123" },
		};

		// @ts-ignore - Mock setup
		tourService.createTour.mockResolvedValue(createdTour);

		render(<TourCreatePage {...defaultProps} />);

		// Fülle Formular aus
		await user.type(screen.getByLabelText(/tour-name/i), "Meine Testtour");
		await user.type(screen.getByLabelText(/startort/i), "Start");
		await user.type(screen.getByLabelText(/endort/i), "Ende");
		await user.type(
			screen.getByLabelText(/geplante startzeit/i),
			"2024-12-25T10:00"
		);
		await user.type(
			screen.getByLabelText(/geplante endzeit/i),
			"2024-12-25T18:00"
		);
		await user.type(
			screen.getByLabelText(/notfallkontakt name/i),
			"Test Contact"
		);
		await user.type(screen.getByLabelText(/telefon/i), "+49123456789");

		const submitButton = screen.getByRole("button", {
			name: /tour erstellen/i,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(ToastService.success).toHaveBeenCalledWith(
				'Tour "Meine Testtour" wurde erfolgreich erstellt!'
			);
		});
	});

	it("sollte Fehler-Toast bei API-Fehlern zeigen", async () => {
		const user = userEvent.setup();

		// @ts-ignore - Mock setup
		tourService.createTour.mockRejectedValue(new Error("API Error"));

		render(<TourCreatePage {...defaultProps} />);

		// Fülle minimal gültiges Formular aus
		await user.type(screen.getByLabelText(/tour-name/i), "Test Tour");
		await user.type(screen.getByLabelText(/startort/i), "Start");
		await user.type(
			screen.getByLabelText(/geplante startzeit/i),
			"2024-12-25T10:00"
		);
		await user.type(
			screen.getByLabelText(/geplante endzeit/i),
			"2024-12-25T18:00"
		);
		await user.type(screen.getByLabelText(/notfallkontakt name/i), "Contact");
		await user.type(screen.getByLabelText(/telefon/i), "+49123456789");

		const submitButton = screen.getByRole("button", {
			name: /tour erstellen/i,
		});
		await user.click(submitButton);

		await waitFor(() => {
			expect(ToastService.error).toHaveBeenCalledWith(
				"Fehler beim Erstellen der Tour. Bitte versuchen Sie es erneut."
			);
		});
	});
});
