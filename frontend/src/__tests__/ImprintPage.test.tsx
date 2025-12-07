import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImprintPage from "../pages/ImprintPage";

describe("ImprintPage", () => {
	it("sollte Impressum-Titel anzeigen", () => {
		const mockOnBack = vi.fn();
		render(<ImprintPage onBack={mockOnBack} />);
		expect(screen.getByText("📄 Impressum")).toBeInTheDocument();
	});

	it("sollte Zurück-Button rendern", () => {
		const mockOnBack = vi.fn();
		render(<ImprintPage onBack={mockOnBack} />);
		const backButton = screen.getByRole("button", { name: /zurück/i });
		expect(backButton).toBeInTheDocument();
	});

	it("sollte onBack aufrufen wenn Zurück-Button geklickt wird", () => {
		const mockOnBack = vi.fn();
		render(<ImprintPage onBack={mockOnBack} />);

		const backButton = screen.getByRole("button", { name: /zurück/i });
		fireEvent.click(backButton);

		expect(mockOnBack).toHaveBeenCalledTimes(1);
	});

	it("sollte wichtige Impressum-Abschnitte enthalten", () => {
		const mockOnBack = vi.fn();
		render(<ImprintPage onBack={mockOnBack} />);

		expect(screen.getByText("Angaben gemäß § 5 TMG")).toBeInTheDocument();
		expect(screen.getByText("Kontakt")).toBeInTheDocument();
		expect(screen.getByText("Haftungsausschluss")).toBeInTheDocument();
		expect(screen.getByText("Open Source")).toBeInTheDocument();
	});

	it("sollte GitHub-Link enthalten", () => {
		const mockOnBack = vi.fn();
		render(<ImprintPage onBack={mockOnBack} />);

		const githubLink = screen.getByRole("link", { name: /github/i });
		expect(githubLink).toBeInTheDocument();
		expect(githubLink).toHaveAttribute("href", "https://github.com/tourguard");
		expect(githubLink).toHaveAttribute("target", "_blank");
	});

	it("sollte Notfall-Warnung anzeigen", () => {
		const mockOnBack = vi.fn();
		render(<ImprintPage onBack={mockOnBack} />);

		expect(
			screen.getByText(/wichtiger hinweis.*tourguard.*notfall/i)
		).toBeInTheDocument();
		expect(screen.getByText(/112 in europa/i)).toBeInTheDocument();
	});

	it("sollte Kontaktinformationen enthalten", () => {
		const mockOnBack = vi.fn();
		render(<ImprintPage onBack={mockOnBack} />);

		expect(screen.getByText(/info@tourguard\.de/)).toBeInTheDocument();
		expect(screen.getByText(/\+49 \(0\) 123 456789/)).toBeInTheDocument();
	});
});
