import React from "react";
import { getAppVersion } from "../config/version";

interface FooterProps {
	onNavigateToImprint?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToImprint }) => {
	return (
		<footer
			style={{
				backgroundColor: "#1f2937",
				color: "#d1d5db",
				padding: "1rem 0",
				marginTop: "auto",
				borderTop: "1px solid #374151",
			}}
		>
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "0 2rem",
					flexWrap: "wrap",
					gap: "1rem",
				}}
			>
				{/* Links */}
				{/* Links */}
				<div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
					{/* Version Info */}
					<div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
						v{getAppVersion()}
					</div>

					{onNavigateToImprint && (
						<button
							onClick={onNavigateToImprint}
							style={{
								background: "none",
								border: "none",
								color: "#60a5fa",
								textDecoration: "underline",
								cursor: "pointer",
								fontSize: "0.875rem",
								padding: 0,
							}}
						>
							Impressum
						</button>
					)}
				</div>{" "}
				{/* GitHub Link */}
				<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
					<a
						href="https://github.com/tourguard"
						target="_blank"
						rel="noopener noreferrer"
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
							color: "#60a5fa",
							textDecoration: "none",
							fontSize: "0.875rem",
						}}
					>
						{/* GitHub Icon */}
						<svg
							width="20"
							height="20"
							fill="currentColor"
							viewBox="0 0 24 24"
							style={{ flexShrink: 0 }}
						>
							<path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
						</svg>
						GitHub
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
