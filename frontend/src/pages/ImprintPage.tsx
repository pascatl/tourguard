import React from "react";

interface ImprintPageProps {
	onBack: () => void;
}

const ImprintPage: React.FC<ImprintPageProps> = ({ onBack }) => {
	return (
		<div
			style={{
				minHeight: "100vh",
				backgroundColor: "#f9fafb",
				padding: "2rem",
			}}
		>
			<div
				style={{
					maxWidth: "800px",
					margin: "0 auto",
					backgroundColor: "white",
					borderRadius: "12px",
					padding: "3rem",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "2rem",
						gap: "1rem",
					}}
				>
					<button
						onClick={onBack}
						style={{
							padding: "0.5rem",
							backgroundColor: "#f3f4f6",
							border: "1px solid #d1d5db",
							borderRadius: "8px",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							fontSize: "1.5rem",
						}}
						title="Zurück"
					>
						←
					</button>
					<h1
						style={{
							fontSize: "2rem",
							fontWeight: "bold",
							color: "#1f2937",
							margin: 0,
						}}
					>
						Impressum
					</h1>
				</div>

				{/* Content */}
				<div style={{ lineHeight: "1.6", color: "#374151" }}>
					<section style={{ marginBottom: "2rem" }}>
						<h2
							style={{
								fontSize: "1.25rem",
								fontWeight: "600",
								color: "#1f2937",
								marginBottom: "0.5rem",
							}}
						>
							Angaben gemäß § 5 TMG
						</h2>
						<p>
							TourGuard
							<br />
							Max Mustermann
							<br />
							Musterstraße 123
							<br />
							12345 Musterstadt
							<br />
							Deutschland
						</p>
					</section>

					<section style={{ marginBottom: "2rem" }}>
						<h2
							style={{
								fontSize: "1.25rem",
								fontWeight: "600",
								color: "#1f2937",
								marginBottom: "0.5rem",
							}}
						>
							Kontakt
						</h2>
						<p>
							Telefon: +49 (0) 123 456789
							<br />
							E-Mail: info@tourguard.de
						</p>
					</section>

					<section style={{ marginBottom: "2rem" }}>
						<h2
							style={{
								fontSize: "1.25rem",
								fontWeight: "600",
								color: "#1f2937",
								marginBottom: "0.5rem",
							}}
						>
							Haftungsausschluss
						</h2>
						<h3
							style={{
								fontSize: "1.1rem",
								fontWeight: "600",
								color: "#1f2937",
								marginBottom: "0.5rem",
							}}
						>
							Haftung für Inhalte
						</h3>
						<p style={{ marginBottom: "1rem" }}>
							Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
							Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
							verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
							jedoch nicht unter der Verpflichtung, übermittelte oder
							gespeicherte fremde Informationen zu überwachen oder nach
							Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
							hinweisen.
						</p>

						<h3
							style={{
								fontSize: "1.1rem",
								fontWeight: "600",
								color: "#1f2937",
								marginBottom: "0.5rem",
							}}
						>
							Haftung für Links
						</h3>
						<p style={{ marginBottom: "1rem" }}>
							Unser Angebot enthält Links zu externen Websites Dritter, auf
							deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
							diese fremden Inhalte auch keine Gewähr übernehmen. Für die
							Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
							oder Betreiber der Seiten verantwortlich.
						</p>

						<h3
							style={{
								fontSize: "1.1rem",
								fontWeight: "600",
								color: "#1f2937",
								marginBottom: "0.5rem",
							}}
						>
							Urheberrecht
						</h3>
						<p>
							Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
							diesen Seiten unterliegen dem deutschen Urheberrecht. Die
							Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
							Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
							schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
						</p>
					</section>

					<section style={{ marginBottom: "2rem" }}>
						<h2
							style={{
								fontSize: "1.25rem",
								fontWeight: "600",
								color: "#1f2937",
								marginBottom: "0.5rem",
							}}
						>
							Open Source
						</h2>
						<p>
							TourGuard ist ein Open-Source-Projekt. Der Quellcode ist verfügbar
							auf{" "}
							<a
								href="https://github.com/tourguard"
								target="_blank"
								rel="noopener noreferrer"
								style={{ color: "#3b82f6", textDecoration: "underline" }}
							>
								GitHub
							</a>
							.
						</p>
					</section>

					<section>
						<h2
							style={{
								fontSize: "1.25rem",
								fontWeight: "600",
								color: "#1f2937",
								marginBottom: "0.5rem",
							}}
						>
							Notfälle und Sicherheit
						</h2>
						<div
							style={{
								backgroundColor: "#fef3c7",
								padding: "1rem",
								borderRadius: "8px",
								border: "1px solid #f59e0b",
							}}
						>
							<p style={{ margin: 0, fontWeight: "600" }}>
								⚠️ Wichtiger Hinweis: TourGuard ist eine Planungs- und
								Tracking-Anwendung. Im Notfall wenden Sie sich immer sofort an
								die örtlichen Rettungsdienste (112 in Europa).
							</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default ImprintPage;
