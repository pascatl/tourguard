import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardPage from "../components/DashboardPage";
import { tourService } from "../services/api";
import { Tour } from "../types/api";

// Mock the API service
vi.mock("../services/api", () => ({
	tourService: {
		getTours: vi.fn(),
		updateTour: vi.fn(),
		checkin: vi.fn(),
		checkout: vi.fn(),
		deleteTour: vi.fn(),
	},
}));

const mockUser = { name: "John Doe", email: "john@example.com" };
const mockOnLogout = vi.fn();
const mockOnCreateTour = vi.fn();

const mockTours: Tour[] = [
	{
		id: "1",
		name: "Test Tour 1",
		description: "First test tour",
		startLocation: "Start 1",
		endLocation: "End 1",
		startTime: "2025-12-08T10:00:00.000Z",
		expectedEndTime: "2025-12-08T18:00:00.000Z",
		emergencyContact: {
			name: "Emergency 1",
			phone: "+49123456789",
		},
		status: "planned",
		createdAt: "2025-12-07T15:00:00.000Z",
		updatedAt: "2025-12-07T15:00:00.000Z",
		checkedIn: false,
		checkedOut: false,
	},
	{
		id: "2",
		name: "Active Tour",
		description: "Currently active tour",
		startLocation: "Start 2",
		endLocation: "End 2",
		startTime: "2025-12-07T08:00:00.000Z",
		expectedEndTime: "2025-12-07T16:00:00.000Z",
		emergencyContact: {
			name: "Emergency 2",
			phone: "+49987654321",
		},
		status: "active",
		createdAt: "2025-12-07T08:00:00.000Z",
		updatedAt: "2025-12-07T09:00:00.000Z",
		checkedIn: true,
		checkedOut: false,
		checkinTime: "2025-12-07T08:30:00.000Z",
	},
];

describe("Dashboard Tour Management Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(tourService.getTours).mockResolvedValue(mockTours);
	});

	it("opens tour detail modal when tour is clicked", async () => {
		render(
			<DashboardPage
				user={mockUser}
				onLogout={mockOnLogout}
				onCreateTour={mockOnCreateTour}
				refreshTrigger={0}
			/>
		);

		// Wait for tours to load
		await waitFor(() => {
			expect(screen.getByText("Test Tour 1")).toBeInTheDocument();
		});

		// Click on the first tour
		fireEvent.click(screen.getByText("Test Tour 1"));

		// Modal should open
		await waitFor(() => {
			expect(screen.getByText("Tour Details")).toBeInTheDocument();
			expect(screen.getByText("📍 Check-in")).toBeInTheDocument(); // Should show check-in button for planned tour
		});
	});

	it("shows appropriate buttons based on tour status", async () => {
		render(
			<DashboardPage
				user={mockUser}
				onLogout={mockOnLogout}
				onCreateTour={mockOnCreateTour}
				refreshTrigger={0}
			/>
		);

		// Wait for tours to load
		await waitFor(() => {
			expect(screen.getByText("Active Tour")).toBeInTheDocument();
		});

		// Click on the active tour
		fireEvent.click(screen.getByText("Active Tour"));

		// Modal should open with check-out button
		await waitFor(() => {
			expect(screen.getByText("Tour Details")).toBeInTheDocument();
			expect(screen.getByText("🏁 Check-out")).toBeInTheDocument(); // Should show check-out for active tour
			expect(screen.queryByText("📍 Check-in")).not.toBeInTheDocument(); // Should not show check-in
		});
	});

	it("performs check-in and refreshes tour list", async () => {
		const updatedTour = {
			...mockTours[0],
			status: "active" as const,
			checkedIn: true,
			checkinTime: "2025-12-08T10:00:00.000Z",
		};

		vi.mocked(tourService.checkin).mockResolvedValue(updatedTour);
		vi.mocked(tourService.getTours)
			.mockResolvedValueOnce(mockTours)
			.mockResolvedValueOnce([updatedTour, mockTours[1]]);

		render(
			<DashboardPage
				user={mockUser}
				onLogout={mockOnLogout}
				onCreateTour={mockOnCreateTour}
				refreshTrigger={0}
			/>
		);

		// Wait for tours to load
		await waitFor(() => {
			expect(screen.getByText("Test Tour 1")).toBeInTheDocument();
		});

		// Click on the planned tour
		fireEvent.click(screen.getByText("Test Tour 1"));

		// Modal should open
		await waitFor(() => {
			expect(screen.getByText("📍 Check-in")).toBeInTheDocument();
		});

		// Click check-in button
		fireEvent.click(screen.getByText("📍 Check-in"));

		// Should call check-in API and refresh
		await waitFor(() => {
			expect(tourService.checkin).toHaveBeenCalledWith("1");
			expect(tourService.getTours).toHaveBeenCalledTimes(2); // Initial load + refresh after check-in
		});
	});

	it("updates tour information and refreshes list", async () => {
		const updatedTour = {
			...mockTours[0],
			name: "Updated Tour Name",
		};

		vi.mocked(tourService.updateTour).mockResolvedValue(updatedTour);
		vi.mocked(tourService.getTours)
			.mockResolvedValueOnce(mockTours)
			.mockResolvedValueOnce([updatedTour, mockTours[1]]);

		render(
			<DashboardPage
				user={mockUser}
				onLogout={mockOnLogout}
				onCreateTour={mockOnCreateTour}
				refreshTrigger={0}
			/>
		);

		// Wait for tours to load
		await waitFor(() => {
			expect(screen.getByText("Test Tour 1")).toBeInTheDocument();
		});

		// Click on the tour
		fireEvent.click(screen.getByText("Test Tour 1"));

		// Enter edit mode
		await waitFor(() => {
			expect(screen.getByText("✏️ Bearbeiten")).toBeInTheDocument();
		});
		fireEvent.click(screen.getByText("✏️ Bearbeiten"));

		// Change tour name
		const nameInput = screen.getByDisplayValue("Test Tour 1");
		fireEvent.change(nameInput, { target: { value: "Updated Tour Name" } });

		// Save changes
		fireEvent.click(screen.getByText("Speichern"));

		// Should call update API and refresh
		await waitFor(() => {
			expect(tourService.updateTour).toHaveBeenCalledWith(
				"1",
				expect.objectContaining({
					name: "Updated Tour Name",
				})
			);
			expect(tourService.getTours).toHaveBeenCalledTimes(2); // Initial load + refresh after update
		});
	});

	it("closes modal when clicking outside or close button", async () => {
		render(
			<DashboardPage
				user={mockUser}
				onLogout={mockOnLogout}
				onCreateTour={mockOnCreateTour}
				refreshTrigger={0}
			/>
		);

		// Wait for tours to load and click on tour
		await waitFor(() => {
			expect(screen.getByText("Test Tour 1")).toBeInTheDocument();
		});
		fireEvent.click(screen.getByText("Test Tour 1"));

		// Modal should be open
		await waitFor(() => {
			expect(screen.getByText("Tour Details")).toBeInTheDocument();
		});

		// Click close button
		fireEvent.click(screen.getByText("✕"));

		// Modal should close
		await waitFor(() => {
			expect(screen.queryByText("Tour Details")).not.toBeInTheDocument();
		});
	});

	it("displays correct tour statistics", async () => {
		render(
			<DashboardPage
				user={mockUser}
				onLogout={mockOnLogout}
				onCreateTour={mockOnCreateTour}
				refreshTrigger={0}
			/>
		);

		await waitFor(() => {
			// Total tours: 2
			expect(screen.getByText("2")).toBeInTheDocument();

			// Check stats are displayed
			const statsElements = screen.getAllByText("1");
			expect(statsElements.length).toBeGreaterThan(0); // 1 planned, 1 active
		});
	});

	it("handles API errors gracefully", async () => {
		vi.mocked(tourService.getTours).mockRejectedValue(new Error("API Error"));

		render(
			<DashboardPage
				user={mockUser}
				onLogout={mockOnLogout}
				onCreateTour={mockOnCreateTour}
				refreshTrigger={0}
			/>
		);

		await waitFor(() => {
			expect(
				screen.getByText("Fehler beim Laden der Touren")
			).toBeInTheDocument();
		});
	});

	it("deletes tour and refreshes list", async () => {
		const mockDeleteTour = vi.mocked(tourService.deleteTour);
		mockDeleteTour.mockResolvedValue();

		// Mock initial tours load, then empty list after delete
		vi.mocked(tourService.getTours)
			.mockResolvedValueOnce(mockTours)
			.mockResolvedValueOnce([mockTours[1]]); // Only second tour remains

		render(
			<DashboardPage
				user={mockUser}
				onLogout={mockOnLogout}
				onCreateTour={mockOnCreateTour}
				refreshTrigger={0}
			/>
		);

		// Wait for tours to load
		await waitFor(() => {
			expect(screen.getByText("Test Tour 1")).toBeInTheDocument();
		});

		// Click on the first tour
		fireEvent.click(screen.getByText("Test Tour 1"));

		// Modal should open
		await waitFor(() => {
			expect(screen.getByText("Tour Details")).toBeInTheDocument();
		});

		// Click delete button
		fireEvent.click(screen.getByText("🗑️ Löschen"));

		// Confirmation dialog should appear
		await waitFor(() => {
			expect(screen.getByText("Tour löschen")).toBeInTheDocument();
		});

		// Confirm deletion
		fireEvent.click(screen.getByText("Löschen"));

		// Should call delete API and refresh
		await waitFor(() => {
			expect(mockDeleteTour).toHaveBeenCalledWith("1");
			expect(tourService.getTours).toHaveBeenCalledTimes(2); // Initial load + refresh after delete
		});
	});

	it("can delete tours regardless of status", async () => {
		const completedTour: Tour = {
			...mockTours[0],
			status: "completed",
			checkedIn: true,
			checkedOut: true,
		};

		vi.mocked(tourService.getTours).mockResolvedValue([completedTour]);

		render(
			<DashboardPage
				user={mockUser}
				onLogout={mockOnLogout}
				onCreateTour={mockOnCreateTour}
				refreshTrigger={0}
			/>
		);

		// Wait for tours to load
		await waitFor(() => {
			expect(screen.getByText("Test Tour 1")).toBeInTheDocument();
		});

		// Click on the completed tour
		fireEvent.click(screen.getByText("Test Tour 1"));

		// Modal should open with delete button available
		await waitFor(() => {
			expect(screen.getByText("Tour Details")).toBeInTheDocument();
			expect(screen.getByText("🗑️ Löschen")).toBeInTheDocument();
		});
	});
});
