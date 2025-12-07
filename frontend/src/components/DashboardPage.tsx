import React from "react";

interface DashboardPageProps {
	user: { name: string; email: string };
	onLogout: () => void;
	onCreateTour: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
	user,
	onLogout,
	onCreateTour,
}) => {
	const mockTours = [
		{
			id: 1,
			name: "Zugspitze über Höllental",
			status: "geplant",
			startDate: "2025-12-15",
			location: "Hammersbach, Bayern",
		},
		{
			id: 2,
			name: "Watzmann Überschreitung",
			status: "aktiv",
			startDate: "2025-12-07",
			location: "Berchtesgaden, Bayern",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "geplant":
				return "#3b82f6";
			case "aktiv":
				return "#10b981";
			case "abgeschlossen":
				return "#6b7280";
			case "überfällig":
				return "#ef4444";
			default:
				return "#6b7280";
		}
	};

	return (
		<div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
			{/* Header */}
			<header
				style={{
					backgroundColor: "white",
					boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
					padding: "0 20px",
				}}
			>
				<div
					style={{
						maxWidth: "1200px",
						margin: "0 auto",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						height: "64px",
					}}
				>
					<div style={{ display: "flex", alignItems: "center" }}>
						<h1
							style={{
								fontSize: "1.5rem",
								fontWeight: "bold",
								color: "#1f2937",
								margin: "0 20px 0 0",
							}}
						>
							🏔️ TourGuard
						</h1>
						<span style={{ color: "#6b7280", fontSize: "14px" }}>
							Willkommen, {user.name}
						</span>
					</div>
					<button
						onClick={onLogout}
						style={{
							backgroundColor: "#6b7280",
							color: "white",
							padding: "8px 16px",
							border: "none",
							borderRadius: "6px",
							fontSize: "14px",
							cursor: "pointer",
						}}
					>
						Abmelden
					</button>
				</div>
			</header>

			{/* Main Content */}
			<main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
				{/* Stats Cards */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
						gap: "20px",
						marginBottom: "30px",
					}}
				>
					<div
						style={{
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "8px",
							boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
						}}
					>
						<h3
							style={{
								margin: "0 0 10px 0",
								color: "#1f2937",
								fontSize: "14px",
							}}
						>
							📅 Geplante Touren
						</h3>
						<p
							style={{
								margin: 0,
								fontSize: "24px",
								fontWeight: "bold",
								color: "#3b82f6",
							}}
						>
							1
						</p>
					</div>

					<div
						style={{
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "8px",
							boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
						}}
					>
						<h3
							style={{
								margin: "0 0 10px 0",
								color: "#1f2937",
								fontSize: "14px",
							}}
						>
							🏃 Aktive Touren
						</h3>
						<p
							style={{
								margin: 0,
								fontSize: "24px",
								fontWeight: "bold",
								color: "#10b981",
							}}
						>
							1
						</p>
					</div>

					<div
						style={{
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "8px",
							boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
						}}
					>
						<h3
							style={{
								margin: "0 0 10px 0",
								color: "#1f2937",
								fontSize: "14px",
							}}
						>
							✅ Abgeschlossene Touren
						</h3>
						<p
							style={{
								margin: 0,
								fontSize: "24px",
								fontWeight: "bold",
								color: "#6b7280",
							}}
						>
							0
						</p>
					</div>

					<div
						style={{
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "8px",
							boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
						}}
					>
						<h3
							style={{
								margin: "0 0 10px 0",
								color: "#1f2937",
								fontSize: "14px",
							}}
						>
							⚠️ Überfällige Touren
						</h3>
						<p
							style={{
								margin: 0,
								fontSize: "24px",
								fontWeight: "bold",
								color: "#ef4444",
							}}
						>
							0
						</p>
					</div>
				</div>

				{/* Tours Section */}
				<div
					style={{
						backgroundColor: "white",
						borderRadius: "8px",
						boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
						padding: "24px",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "20px",
						}}
					>
						<h3 style={{ margin: 0, fontSize: "18px", color: "#1f2937" }}>
							Meine Touren
						</h3>
						<button
							onClick={onCreateTour}
							style={{
								backgroundColor: "#3b82f6",
								color: "white",
								padding: "10px 20px",
								border: "none",
								borderRadius: "6px",
								fontSize: "14px",
								cursor: "pointer",
								fontWeight: "500",
							}}
						>
							➕ Neue Tour
						</button>
					</div>

					{/* Tours List */}
					<div style={{ display: "grid", gap: "16px" }}>
						{mockTours.map((tour) => (
							<div
								key={tour.id}
								style={{
									border: "1px solid #e5e7eb",
									borderRadius: "8px",
									padding: "20px",
									cursor: "pointer",
									transition: "box-shadow 0.2s",
								}}
								onMouseOver={(e) =>
									(e.currentTarget.style.boxShadow =
										"0 4px 6px rgba(0,0,0,0.1)")
								}
								onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "start",
										marginBottom: "10px",
									}}
								>
									<h4 style={{ margin: 0, fontSize: "16px", color: "#1f2937" }}>
										{tour.name}
									</h4>
									<span
										style={{
											backgroundColor: getStatusColor(tour.status),
											color: "white",
											padding: "4px 12px",
											borderRadius: "12px",
											fontSize: "12px",
											fontWeight: "500",
										}}
									>
										{tour.status}
									</span>
								</div>
								<div
									style={{
										display: "flex",
										gap: "20px",
										fontSize: "14px",
										color: "#6b7280",
									}}
								>
									<span>📍 {tour.location}</span>
									<span>📅 {tour.startDate}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Help Section */}
				<div
					style={{
						marginTop: "30px",
						backgroundColor: "#f3f4f6",
						padding: "20px",
						borderRadius: "8px",
					}}
				>
					<h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>
						💡 Nächste Schritte:
					</h4>
					<ul style={{ margin: 0, paddingLeft: "20px", color: "#6b7280" }}>
						<li>
							Erstellen Sie Ihre erste Bergtour mit dem "Neue Tour" Button
						</li>
						<li>
							Laden Sie GPX-Dateien hoch oder setzen Sie Wegpunkte auf der Karte
						</li>
						<li>
							Vergessen Sie nicht den Check-in vor und Check-out nach der Tour
						</li>
					</ul>
				</div>
			</main>
		</div>
	);
};

export default DashboardPage;
