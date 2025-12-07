import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TourDetailModal from "../components/TourDetailModal";
import { tourService } from "../services/api";
import { Tour } from "../types/api";
import { ToastService } from "../services/toastService";

// Mock the API service
vi.mock("../services/api", () => ({
	tourService: {
		updateTour: vi.fn(),
		checkin: vi.fn(),
		checkout: vi.fn(),
		deleteTour: vi.fn(),
	},
}));

// Mock the ToastService
vi.mock("../services/toastService", () => ({
	ToastService: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

const mockTour: Tour = {
	id: "1",
	name: "Test Tour",
	description: "Test description",
	startLocation: "Start Point",
	endLocation: "End Point",
	startTime: "2025-12-08T10:00:00.000Z",
	expectedEndTime: "2025-12-08T18:00:00.000Z",
	emergencyContact: {
		name: "Emergency Contact",
		phone: "+49123456789",
	},
	status: "planned",
	createdAt: "2025-12-07T15:00:00.000Z",
	updatedAt: "2025-12-07T15:00:00.000Z",
	checkedIn: false,
	checkedOut: false,
};

describe("TourDetailModal", () => {
	const mockOnClose = vi.fn();
	const mockOnTourUpdated = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders tour details correctly", () => {
		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		expect(screen.getByText("Tour Details")).toBeInTheDocument();
		expect(screen.getByText("Test Tour")).toBeInTheDocument();
		expect(screen.getByText("Test description")).toBeInTheDocument();
		expect(screen.getByText("Start Point")).toBeInTheDocument();
		expect(screen.getByText("End Point")).toBeInTheDocument();
		expect(
			screen.getByText("Emergency Contact - +49123456789")
		).toBeInTheDocument();
	});

	it("shows check-in button for planned tour", () => {
		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		expect(screen.getByText("📍 Check-in")).toBeInTheDocument();
		expect(screen.queryByText("🏁 Check-out")).not.toBeInTheDocument();
	});

	it("shows check-out button for active checked-in tour", () => {
		const activeTour: Tour = {
			...mockTour,
			status: "active",
			checkedIn: true,
			checkinTime: "2025-12-08T09:00:00.000Z",
		};

		render(
			<TourDetailModal
				tour={activeTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		expect(screen.getByText("🏁 Check-out")).toBeInTheDocument();
		expect(screen.queryByText("📍 Check-in")).not.toBeInTheDocument();
	});

	it("enters edit mode when edit button is clicked", async () => {
		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		fireEvent.click(screen.getByText("✏️ Bearbeiten"));

		expect(screen.getByText("Tour bearbeiten")).toBeInTheDocument();
		expect(screen.getByDisplayValue("Test Tour")).toBeInTheDocument();
		expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
		expect(screen.getByText("Speichern")).toBeInTheDocument();
		expect(screen.getByText("Abbrechen")).toBeInTheDocument();
	});

	it("calls updateTour API when saving changes", async () => {
		const mockUpdateTour = vi.mocked(tourService.updateTour);
		mockUpdateTour.mockResolvedValue({ ...mockTour, name: "Updated Tour" });

		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		// Enter edit mode
		fireEvent.click(screen.getByText("✏️ Bearbeiten"));

		// Change tour name
		const nameInput = screen.getByDisplayValue("Test Tour");
		fireEvent.change(nameInput, { target: { value: "Updated Tour" } });

		// Save changes
		fireEvent.click(screen.getByText("Speichern"));

		await waitFor(() => {
			expect(mockUpdateTour).toHaveBeenCalledWith(
				"1",
				expect.objectContaining({
					name: "Updated Tour",
				})
			);
			expect(mockOnTourUpdated).toHaveBeenCalled();
		});
	});

	it("calls checkin API when check-in button is clicked", async () => {
		const mockCheckin = vi.mocked(tourService.checkin);
		mockCheckin.mockResolvedValue({
			...mockTour,
			checkedIn: true,
			status: "active",
			checkinTime: "2025-12-08T09:00:00.000Z",
		});

		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		fireEvent.click(screen.getByText("📍 Check-in"));

		await waitFor(() => {
			expect(mockCheckin).toHaveBeenCalledWith("1");
			expect(mockOnTourUpdated).toHaveBeenCalled();
		});
	});

	it("calls checkout API when check-out button is clicked", async () => {
		const activeTour: Tour = {
			...mockTour,
			status: "active",
			checkedIn: true,
			checkinTime: "2025-12-08T09:00:00.000Z",
		};

		const mockCheckout = vi.mocked(tourService.checkout);
		mockCheckout.mockResolvedValue({
			...activeTour,
			checkedOut: true,
			status: "completed",
			checkoutTime: "2025-12-08T17:00:00.000Z",
		});

		render(
			<TourDetailModal
				tour={activeTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		fireEvent.click(screen.getByText("🏁 Check-out"));

		await waitFor(() => {
			expect(mockCheckout).toHaveBeenCalledWith("1");
			expect(mockOnTourUpdated).toHaveBeenCalled();
		});
	});

	it("shows check-in and check-out times when available", () => {
		const completedTour: Tour = {
			...mockTour,
			status: "completed",
			checkedIn: true,
			checkedOut: true,
			checkinTime: "2025-12-08T09:00:00.000Z",
			checkoutTime: "2025-12-08T17:00:00.000Z",
		};

		render(
			<TourDetailModal
				tour={completedTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		expect(screen.getByText(/✅ Check-in:/)).toBeInTheDocument();
		expect(screen.getByText(/🏁 Check-out:/)).toBeInTheDocument();
	});

	it("handles API errors gracefully", async () => {
		const mockCheckin = vi.mocked(tourService.checkin);
		mockCheckin.mockRejectedValue(new Error("API Error"));

		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		fireEvent.click(screen.getByText("📍 Check-in"));

		await waitFor(() => {
			expect(screen.getByText("Fehler beim Check-in")).toBeInTheDocument();
		});
	});

	it("closes modal when close button is clicked", () => {
		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		fireEvent.click(screen.getByText("✕"));

		expect(mockOnClose).toHaveBeenCalled();
	});

	it("does not render when isOpen is false", () => {
		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={false}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		expect(screen.queryByText("Tour Details")).not.toBeInTheDocument();
	});

	it("shows delete button for all tours", () => {
		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		expect(screen.getByText("🗑️ Löschen")).toBeInTheDocument();
	});

	it("shows delete confirmation dialog when delete button is clicked", async () => {
		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		fireEvent.click(screen.getByText("🗑️ Löschen"));

		await waitFor(() => {
			expect(screen.getByText("Tour löschen")).toBeInTheDocument();
			expect(screen.getByText(/Sind Sie sicher/)).toBeInTheDocument();
			expect(screen.getByText('"Test Tour"')).toBeInTheDocument();
		});
	});

	it("cancels delete when cancel button is clicked", async () => {
		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		fireEvent.click(screen.getByText("🗑️ Löschen"));

		await waitFor(() => {
			expect(screen.getByText("Abbrechen")).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText("Abbrechen"));

		await waitFor(() => {
			expect(screen.queryByText("Tour löschen")).not.toBeInTheDocument();
		});
	});

	it("calls deleteTour API when delete is confirmed", async () => {
		const mockDeleteTour = vi.mocked(tourService.deleteTour);
		mockDeleteTour.mockResolvedValue();

		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		fireEvent.click(screen.getByText("🗑️ Löschen"));

		await waitFor(() => {
			expect(screen.getByText("Tour löschen")).toBeInTheDocument();
		});

		// Click the confirm delete button in the dialog
		fireEvent.click(screen.getByText("Löschen"));

		await waitFor(() => {
			expect(mockDeleteTour).toHaveBeenCalledWith("1");
			expect(mockOnTourUpdated).toHaveBeenCalled();
			expect(ToastService.success).toHaveBeenCalledWith(
				'Tour "Test Tour" wurde erfolgreich gelöscht'
			);
		});
	});

	it("handles delete API errors gracefully", async () => {
		const mockDeleteTour = vi.mocked(tourService.deleteTour);
		mockDeleteTour.mockRejectedValue(new Error("API Error"));

		render(
			<TourDetailModal
				tour={mockTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		fireEvent.click(screen.getByText("🗑️ Löschen"));

		await waitFor(() => {
			expect(screen.getByText("Tour löschen")).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText("Löschen"));

		await waitFor(() => {
			expect(
				screen.getByText("Fehler beim Löschen der Tour")
			).toBeInTheDocument();
		});
	});

	it("can delete tours regardless of status", () => {
		const completedTour: Tour = {
			...mockTour,
			status: "completed",
			checkedIn: true,
			checkedOut: true,
		};

		render(
			<TourDetailModal
				tour={completedTour}
				isOpen={true}
				onClose={mockOnClose}
				onTourUpdated={mockOnTourUpdated}
			/>
		);

		// Delete button should be available even for completed tours
		expect(screen.getByText("🗑️ Löschen")).toBeInTheDocument();
	});
});
