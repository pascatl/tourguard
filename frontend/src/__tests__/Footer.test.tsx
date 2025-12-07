import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../components/Footer";

describe("Footer", () => {
	it("sollte Copyright-Text anzeigen", () => {
		render(<Footer />);
		expect(screen.getByText("© 2025 TourGuard")).toBeInTheDocument();
	});

	it("sollte GitHub-Link korrekt rendern", () => {
		render(<Footer />);
		const githubLink = screen.getByRole("link", { name: /github/i });
		expect(githubLink).toBeInTheDocument();
		expect(githubLink).toHaveAttribute("href", "https://github.com/tourguard");
		expect(githubLink).toHaveAttribute("target", "_blank");
	});

	it("sollte Impressum-Button anzeigen wenn onNavigateToImprint übergeben wird", () => {
		const mockNavigate = vi.fn();
		render(<Footer onNavigateToImprint={mockNavigate} />);

		const imprintButton = screen.getByText("Impressum");
		expect(imprintButton).toBeInTheDocument();
	});

	it("sollte onNavigateToImprint aufrufen wenn Impressum-Button geklickt wird", () => {
		const mockNavigate = vi.fn();
		render(<Footer onNavigateToImprint={mockNavigate} />);

		const imprintButton = screen.getByText("Impressum");
		fireEvent.click(imprintButton);

		expect(mockNavigate).toHaveBeenCalledTimes(1);
	});

	it("sollte keinen Impressum-Button anzeigen wenn onNavigateToImprint nicht übergeben wird", () => {
		render(<Footer />);
		expect(screen.queryByText("Impressum")).not.toBeInTheDocument();
	});

	it("sollte GitHub-Icon korrekt rendern", () => {
		render(<Footer />);
		const githubIcon = screen
			.getByRole("link", { name: /github/i })
			.querySelector("svg");
		expect(githubIcon).toBeInTheDocument();
		expect(githubIcon).toHaveAttribute("viewBox", "0 0 24 24");
	});
});
