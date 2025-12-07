import { vi } from "vitest";

// Mock für die API Services
export const mockTourService = {
	getTours: vi.fn(),
	createTour: vi.fn(),
	updateTour: vi.fn(),
	deleteTour: vi.fn(),
};

export const mockAuthService = {
	login: vi.fn(),
	register: vi.fn(),
	logout: vi.fn(),
	getCurrentUser: vi.fn(),
};

// Mock User für Tests
export const mockUser = {
	id: 1,
	name: "Test User",
	email: "test@tourguard.de",
};

// Mock Tour für Tests
export const mockTour = {
	id: 1,
	name: "Test Tour",
	startLocation: "Test Start",
	endLocation: "Test End",
	startTime: "2025-12-08T10:00:00Z",
	expectedEndTime: "2025-12-08T16:00:00Z",
	status: "planned" as const,
	emergencyContact: {
		name: "Test Contact",
		phone: "+49123456789",
	},
	userId: 1,
	createdAt: "2025-12-07T14:00:00Z",
	updatedAt: "2025-12-07T14:00:00Z",
};

// Helper für das Rendern von Components mit AuthContext
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { AuthProvider } from "../contexts/AuthContext";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
	authValue?: {
		user: typeof mockUser | null;
		login: () => Promise<void>;
		logout: () => void;
		register: () => Promise<void>;
	};
}

export const renderWithAuth = (
	ui: ReactElement,
	options: CustomRenderOptions = {}
) => {
	const { authValue, ...renderOptions } = options;

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<AuthProvider>{children}</AuthProvider>
	);

	return render(ui, { wrapper: Wrapper, ...renderOptions });
};
