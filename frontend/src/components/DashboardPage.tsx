import React, { useState, useEffect } from "react";
import { tourService } from "../services/api";
import { Tour } from "../types/api";

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
	const [tours, setTours] = useState<Tour[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadTours();
	}, []);

	const loadTours = async () => {
		try {
			setLoading(true);
			setError(null);
			const userTours = await tourService.getTours();
			setTours(userTours);
		} catch (error: any) {
			console.error("Fehler beim Laden der Touren:", error);
			setError("Fehler beim Laden der Touren");
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "planned":
				return "#3b82f6";
			case "active":
				return "#10b981";
			case "completed":
				return "#6b7280";
			case "overdue":
				return "#ef4444";
			default:
				return "#6b7280";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "planned":
				return "Geplant";
			case "active":
				return "Aktiv";
			case "completed":
				return "Abgeschlossen";
			case "overdue":
				return "Überfällig";
			default:
				return status;
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("de-DE", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getStats = () => {
		// Sicherstellen dass tours ein Array ist
		const safeTours = Array.isArray(tours) ? tours : [];
		return {
			total: safeTours.length,
			planned: safeTours.filter((t: Tour) => t.status === "planned").length,
			active: safeTours.filter((t: Tour) => t.status === "active").length,
			completed: safeTours.filter((t: Tour) => t.status === "completed").length,
		};
	};

	const stats = getStats();
	// Sicherstellen dass tours ein Array ist für Rendering
	const safeTours = Array.isArray(tours) ? tours : [];

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
							borderRadius: "12px",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
							textAlign: "center",
						}}
					>
						<h3
							style={{
								color: "#6b7280",
								margin: "0 0 8px 0",
								fontSize: "14px",
							}}
						>
							Gesamt
						</h3>
						<p
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								color: "#1f2937",
								margin: 0,
							}}
						>
							{stats.total}
						</p>
					</div>

					<div
						style={{
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "12px",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
							textAlign: "center",
						}}
					>
						<h3
							style={{
								color: "#6b7280",
								margin: "0 0 8px 0",
								fontSize: "14px",
							}}
						>
							Geplant
						</h3>
						<p
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								color: "#3b82f6",
								margin: 0,
							}}
						>
							{stats.planned}
						</p>
					</div>

					<div
						style={{
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "12px",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
							textAlign: "center",
						}}
					>
						<h3
							style={{
								color: "#6b7280",
								margin: "0 0 8px 0",
								fontSize: "14px",
							}}
						>
							Aktiv
						</h3>
						<p
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								color: "#10b981",
								margin: 0,
							}}
						>
							{stats.active}
						</p>
					</div>

					<div
						style={{
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "12px",
							boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
							textAlign: "center",
						}}
					>
						<h3
							style={{
								color: "#6b7280",
								margin: "0 0 8px 0",
								fontSize: "14px",
							}}
						>
							Abgeschlossen
						</h3>
						<p
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								color: "#6b7280",
								margin: 0,
							}}
						>
							{stats.completed}
						</p>
					</div>
				</div>

				{/* Action Section */}
				<div
					style={{
						backgroundColor: "white",
						padding: "20px",
						borderRadius: "12px",
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
						marginBottom: "30px",
						textAlign: "center",
					}}
				>
					<h2
						style={{
							fontSize: "1.25rem",
							fontWeight: "600",
							color: "#1f2937",
							marginBottom: "15px",
						}}
					>
						Tour Management
					</h2>
					<button
						onClick={onCreateTour}
						style={{
							backgroundColor: "#3b82f6",
							color: "white",
							padding: "12px 24px",
							border: "none",
							borderRadius: "8px",
							fontSize: "16px",
							fontWeight: "600",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "8px",
							margin: "0 auto",
						}}
					>
						➕ Neue Tour erstellen
					</button>
				</div>

				{/* Tours List */}
				<div
					style={{
						backgroundColor: "white",
						borderRadius: "12px",
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
					}}
				>
					<div
						style={{
							padding: "20px",
							borderBottom: "1px solid #e5e7eb",
						}}
					>
						<h2
							style={{
								fontSize: "1.25rem",
								fontWeight: "600",
								color: "#1f2937",
								margin: 0,
							}}
						>
							Meine Touren ({safeTours.length})
						</h2>
					</div>

					<div style={{ padding: "20px" }}>
						{loading ? (
							<div
								style={{
									textAlign: "center",
									padding: "40px",
									color: "#6b7280",
								}}
							>
								Lade Touren...
							</div>
						) : error ? (
							<div style={{ textAlign: "center", padding: "40px" }}>
								<p style={{ color: "#ef4444", marginBottom: "15px" }}>
									{error}
								</p>
								<button
									onClick={loadTours}
									style={{
										backgroundColor: "#3b82f6",
										color: "white",
										padding: "8px 16px",
										border: "none",
										borderRadius: "6px",
										fontSize: "14px",
										cursor: "pointer",
									}}
								>
									Erneut versuchen
								</button>
							</div>
						) : safeTours.length === 0 ? (
							<div
								style={{
									textAlign: "center",
									padding: "40px",
									color: "#6b7280",
								}}
							>
								<p style={{ fontSize: "18px", marginBottom: "15px" }}>
									🎒 Keine Touren gefunden
								</p>
								<p style={{ marginBottom: "20px" }}>
									Erstellen Sie Ihre erste Bergtour für mehr Sicherheit
									unterwegs.
								</p>
								<button
									onClick={onCreateTour}
									style={{
										backgroundColor: "#3b82f6",
										color: "white",
										padding: "12px 24px",
										border: "none",
										borderRadius: "8px",
										fontSize: "16px",
										fontWeight: "600",
										cursor: "pointer",
									}}
								>
									Erste Tour erstellen
								</button>
							</div>
						) : (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "15px",
								}}
							>
								{safeTours.map((tour: Tour) => (
									<div
										key={tour.id}
										style={{
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
											padding: "20px",
											transition: "all 0.2s",
											cursor: "pointer",
										}}
										onMouseEnter={(e: React.MouseEvent) => {
											const target = e.currentTarget as HTMLElement;
											target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
											target.style.borderColor = "#3b82f6";
										}}
										onMouseLeave={(e: React.MouseEvent) => {
											const target = e.currentTarget as HTMLElement;
											target.style.boxShadow = "none";
											target.style.borderColor = "#e5e7eb";
										}}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "flex-start",
												marginBottom: "10px",
											}}
										>
											<h3
												style={{
													fontSize: "1.1rem",
													fontWeight: "600",
													color: "#1f2937",
													margin: 0,
												}}
											>
												{tour.name}
											</h3>
											<span
												style={{
													backgroundColor: getStatusColor(tour.status),
													color: "white",
													padding: "4px 12px",
													borderRadius: "12px",
													fontSize: "12px",
													fontWeight: "600",
												}}
											>
												{getStatusText(tour.status)}
											</span>
										</div>

										{tour.description && (
											<p
												style={{
													color: "#6b7280",
													margin: "8px 0",
													fontSize: "14px",
												}}
											>
												{tour.description}
											</p>
										)}

										<div
											style={{
												display: "grid",
												gridTemplateColumns: "1fr 1fr",
												gap: "10px",
												marginTop: "15px",
											}}
										>
											<div>
												<span
													style={{
														fontSize: "12px",
														color: "#6b7280",
														display: "block",
													}}
												>
													Startort:
												</span>
												<span
													style={{
														fontSize: "14px",
														color: "#1f2937",
														fontWeight: "500",
													}}
												>
													{tour.startLocation}
												</span>
											</div>

											<div>
												<span
													style={{
														fontSize: "12px",
														color: "#6b7280",
														display: "block",
													}}
												>
													Geplante Startzeit:
												</span>
												<span
													style={{
														fontSize: "14px",
														color: "#1f2937",
														fontWeight: "500",
													}}
												>
													{formatDate(tour.startTime)}
												</span>
											</div>

											{tour.endLocation && (
												<div>
													<span
														style={{
															fontSize: "12px",
															color: "#6b7280",
															display: "block",
														}}
													>
														Zielort:
													</span>
													<span
														style={{
															fontSize: "14px",
															color: "#1f2937",
															fontWeight: "500",
														}}
													>
														{tour.endLocation}
													</span>
												</div>
											)}

											<div>
												<span
													style={{
														fontSize: "12px",
														color: "#6b7280",
														display: "block",
													}}
												>
													Notfallkontakt:
												</span>
												<span
													style={{
														fontSize: "14px",
														color: "#1f2937",
														fontWeight: "500",
													}}
												>
													{tour.emergencyContact?.name}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default DashboardPage;
