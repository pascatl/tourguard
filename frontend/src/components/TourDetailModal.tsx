import React, { useState, useEffect } from "react";
import { Tour } from "../types/api";
import { tourService } from "../services/api";

interface TourDetailModalProps {
	tour: Tour;
	isOpen: boolean;
	onClose: () => void;
	onTourUpdated: () => void;
}

const TourDetailModal: React.FC<TourDetailModalProps> = ({
	tour,
	isOpen,
	onClose,
	onTourUpdated,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [editedTour, setEditedTour] = useState<Partial<Tour>>({});
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setEditedTour({
			name: tour.name,
			description: tour.description,
			startLocation: tour.startLocation,
			endLocation: tour.endLocation,
			startTime: tour.startTime,
			expectedEndTime: tour.expectedEndTime,
			emergencyContact: tour.emergencyContact,
		});
	}, [tour]);

	if (!isOpen) return null;

	const handleSave = async () => {
		try {
			setLoading(true);
			setError(null);
			await tourService.updateTour(tour.id, editedTour);
			setIsEditing(false);
			onTourUpdated();
		} catch (error: any) {
			console.error("Fehler beim Speichern:", error);
			setError("Fehler beim Speichern der Tour");
		} finally {
			setLoading(false);
		}
	};

	const handleCheckin = async () => {
		try {
			setLoading(true);
			setError(null);
			await tourService.checkin(tour.id);
			onTourUpdated();
		} catch (error: any) {
			console.error("Fehler beim Check-in:", error);
			setError("Fehler beim Check-in");
		} finally {
			setLoading(false);
		}
	};

	const handleCheckout = async () => {
		try {
			setLoading(true);
			setError(null);
			await tourService.checkout(tour.id);
			onTourUpdated();
		} catch (error: any) {
			console.error("Fehler beim Check-out:", error);
			setError("Fehler beim Check-out");
		} finally {
			setLoading(false);
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

	const canCheckin = tour.status === "planned" && !tour.checkedIn;
	const canCheckout =
		tour.status === "active" && tour.checkedIn && !tour.checkedOut;

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000,
				padding: "20px",
			}}
			onClick={onClose}
		>
			<div
				style={{
					backgroundColor: "white",
					borderRadius: "12px",
					maxWidth: "600px",
					width: "100%",
					maxHeight: "90vh",
					overflow: "auto",
					boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div
					style={{
						padding: "20px",
						borderBottom: "1px solid #e5e7eb",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						<h2
							style={{
								fontSize: "1.5rem",
								fontWeight: "600",
								color: "#1f2937",
								margin: 0,
							}}
						>
							{isEditing ? "Tour bearbeiten" : "Tour Details"}
						</h2>
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
					<button
						onClick={onClose}
						style={{
							background: "none",
							border: "none",
							fontSize: "24px",
							cursor: "pointer",
							color: "#6b7280",
							padding: "4px",
						}}
					>
						✕
					</button>
				</div>

				{/* Content */}
				<div style={{ padding: "20px" }}>
					{error && (
						<div
							style={{
								backgroundColor: "#fee2e2",
								border: "1px solid #fecaca",
								color: "#dc2626",
								padding: "12px",
								borderRadius: "6px",
								marginBottom: "20px",
							}}
						>
							{error}
						</div>
					)}

					{/* Action Buttons */}
					<div
						style={{
							display: "flex",
							gap: "10px",
							marginBottom: "20px",
							flexWrap: "wrap",
						}}
					>
						{!isEditing ? (
							<>
								<button
									onClick={() => setIsEditing(true)}
									style={{
										backgroundColor: "#3b82f6",
										color: "white",
										padding: "8px 16px",
										border: "none",
										borderRadius: "6px",
										fontSize: "14px",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										gap: "6px",
									}}
								>
									✏️ Bearbeiten
								</button>

								{canCheckin && (
									<button
										onClick={handleCheckin}
										disabled={loading}
										style={{
											backgroundColor: "#10b981",
											color: "white",
											padding: "8px 16px",
											border: "none",
											borderRadius: "6px",
											fontSize: "14px",
											cursor: loading ? "not-allowed" : "pointer",
											opacity: loading ? 0.6 : 1,
											display: "flex",
											alignItems: "center",
											gap: "6px",
										}}
									>
										📍 Check-in
									</button>
								)}

								{canCheckout && (
									<button
										onClick={handleCheckout}
										disabled={loading}
										style={{
											backgroundColor: "#ef4444",
											color: "white",
											padding: "8px 16px",
											border: "none",
											borderRadius: "6px",
											fontSize: "14px",
											cursor: loading ? "not-allowed" : "pointer",
											opacity: loading ? 0.6 : 1,
											display: "flex",
											alignItems: "center",
											gap: "6px",
										}}
									>
										🏁 Check-out
									</button>
								)}
							</>
						) : (
							<>
								<button
									onClick={handleSave}
									disabled={loading}
									style={{
										backgroundColor: "#10b981",
										color: "white",
										padding: "8px 16px",
										border: "none",
										borderRadius: "6px",
										fontSize: "14px",
										cursor: loading ? "not-allowed" : "pointer",
										opacity: loading ? 0.6 : 1,
									}}
								>
									{loading ? "Speichere..." : "Speichern"}
								</button>
								<button
									onClick={() => {
										setIsEditing(false);
										setError(null);
									}}
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
									Abbrechen
								</button>
							</>
						)}
					</div>

					{/* Tour Details */}
					<div
						style={{
							display: "grid",
							gap: "15px",
						}}
					>
						{/* Name */}
						<div>
							<label
								style={{
									display: "block",
									fontSize: "14px",
									fontWeight: "500",
									color: "#374151",
									marginBottom: "5px",
								}}
							>
								Tour Name
							</label>
							{isEditing ? (
								<input
									type="text"
									value={editedTour.name || ""}
									onChange={(e) =>
										setEditedTour({ ...editedTour, name: e.target.value })
									}
									style={{
										width: "100%",
										padding: "8px 12px",
										border: "1px solid #d1d5db",
										borderRadius: "6px",
										fontSize: "14px",
										boxSizing: "border-box",
									}}
								/>
							) : (
								<p
									style={{
										margin: 0,
										padding: "8px 12px",
										backgroundColor: "#f9fafb",
										borderRadius: "6px",
										fontSize: "14px",
									}}
								>
									{tour.name}
								</p>
							)}
						</div>

						{/* Description */}
						<div>
							<label
								style={{
									display: "block",
									fontSize: "14px",
									fontWeight: "500",
									color: "#374151",
									marginBottom: "5px",
								}}
							>
								Beschreibung
							</label>
							{isEditing ? (
								<textarea
									value={editedTour.description || ""}
									onChange={(e) =>
										setEditedTour({
											...editedTour,
											description: e.target.value,
										})
									}
									rows={3}
									style={{
										width: "100%",
										padding: "8px 12px",
										border: "1px solid #d1d5db",
										borderRadius: "6px",
										fontSize: "14px",
										boxSizing: "border-box",
										resize: "vertical",
									}}
								/>
							) : (
								<p
									style={{
										margin: 0,
										padding: "8px 12px",
										backgroundColor: "#f9fafb",
										borderRadius: "6px",
										fontSize: "14px",
									}}
								>
									{tour.description || "Keine Beschreibung"}
								</p>
							)}
						</div>

						{/* Locations */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "15px",
							}}
						>
							<div>
								<label
									style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "500",
										color: "#374151",
										marginBottom: "5px",
									}}
								>
									Startort
								</label>
								{isEditing ? (
									<input
										type="text"
										value={editedTour.startLocation || ""}
										onChange={(e) =>
											setEditedTour({
												...editedTour,
												startLocation: e.target.value,
											})
										}
										style={{
											width: "100%",
											padding: "8px 12px",
											border: "1px solid #d1d5db",
											borderRadius: "6px",
											fontSize: "14px",
											boxSizing: "border-box",
										}}
									/>
								) : (
									<p
										style={{
											margin: 0,
											padding: "8px 12px",
											backgroundColor: "#f9fafb",
											borderRadius: "6px",
											fontSize: "14px",
										}}
									>
										{tour.startLocation}
									</p>
								)}
							</div>

							<div>
								<label
									style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "500",
										color: "#374151",
										marginBottom: "5px",
									}}
								>
									Zielort
								</label>
								{isEditing ? (
									<input
										type="text"
										value={editedTour.endLocation || ""}
										onChange={(e) =>
											setEditedTour({
												...editedTour,
												endLocation: e.target.value,
											})
										}
										style={{
											width: "100%",
											padding: "8px 12px",
											border: "1px solid #d1d5db",
											borderRadius: "6px",
											fontSize: "14px",
											boxSizing: "border-box",
										}}
									/>
								) : (
									<p
										style={{
											margin: 0,
											padding: "8px 12px",
											backgroundColor: "#f9fafb",
											borderRadius: "6px",
											fontSize: "14px",
										}}
									>
										{tour.endLocation || "Keine Angabe"}
									</p>
								)}
							</div>
						</div>

						{/* Times */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "15px",
							}}
						>
							<div>
								<label
									style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "500",
										color: "#374151",
										marginBottom: "5px",
									}}
								>
									Startzeit
								</label>
								{isEditing ? (
									<input
										type="datetime-local"
										value={
											editedTour.startTime
												? new Date(editedTour.startTime)
														.toISOString()
														.slice(0, 16)
												: ""
										}
										onChange={(e) =>
											setEditedTour({
												...editedTour,
												startTime: new Date(e.target.value).toISOString(),
											})
										}
										style={{
											width: "100%",
											padding: "8px 12px",
											border: "1px solid #d1d5db",
											borderRadius: "6px",
											fontSize: "14px",
											boxSizing: "border-box",
										}}
									/>
								) : (
									<p
										style={{
											margin: 0,
											padding: "8px 12px",
											backgroundColor: "#f9fafb",
											borderRadius: "6px",
											fontSize: "14px",
										}}
									>
										{formatDate(tour.startTime)}
									</p>
								)}
							</div>

							<div>
								<label
									style={{
										display: "block",
										fontSize: "14px",
										fontWeight: "500",
										color: "#374151",
										marginBottom: "5px",
									}}
								>
									Geplantes Ende
								</label>
								{isEditing ? (
									<input
										type="datetime-local"
										value={
											editedTour.expectedEndTime
												? new Date(editedTour.expectedEndTime)
														.toISOString()
														.slice(0, 16)
												: ""
										}
										onChange={(e) =>
											setEditedTour({
												...editedTour,
												expectedEndTime: new Date(e.target.value).toISOString(),
											})
										}
										style={{
											width: "100%",
											padding: "8px 12px",
											border: "1px solid #d1d5db",
											borderRadius: "6px",
											fontSize: "14px",
											boxSizing: "border-box",
										}}
									/>
								) : (
									<p
										style={{
											margin: 0,
											padding: "8px 12px",
											backgroundColor: "#f9fafb",
											borderRadius: "6px",
											fontSize: "14px",
										}}
									>
										{formatDate(tour.expectedEndTime)}
									</p>
								)}
							</div>
						</div>

						{/* Emergency Contact */}
						<div>
							<label
								style={{
									display: "block",
									fontSize: "14px",
									fontWeight: "500",
									color: "#374151",
									marginBottom: "5px",
								}}
							>
								Notfallkontakt
							</label>
							{isEditing ? (
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "10px",
									}}
								>
									<input
										type="text"
										placeholder="Name"
										value={editedTour.emergencyContact?.name || ""}
										onChange={(e) =>
											setEditedTour({
												...editedTour,
												emergencyContact: {
													...editedTour.emergencyContact,
													name: e.target.value,
													phone: editedTour.emergencyContact?.phone || "",
												},
											})
										}
										style={{
											width: "100%",
											padding: "8px 12px",
											border: "1px solid #d1d5db",
											borderRadius: "6px",
											fontSize: "14px",
											boxSizing: "border-box",
										}}
									/>
									<input
										type="tel"
										placeholder="Telefon"
										value={editedTour.emergencyContact?.phone || ""}
										onChange={(e) =>
											setEditedTour({
												...editedTour,
												emergencyContact: {
													name: editedTour.emergencyContact?.name || "",
													phone: e.target.value,
												},
											})
										}
										style={{
											width: "100%",
											padding: "8px 12px",
											border: "1px solid #d1d5db",
											borderRadius: "6px",
											fontSize: "14px",
											boxSizing: "border-box",
										}}
									/>
								</div>
							) : (
								<p
									style={{
										margin: 0,
										padding: "8px 12px",
										backgroundColor: "#f9fafb",
										borderRadius: "6px",
										fontSize: "14px",
									}}
								>
									{tour.emergencyContact?.name} - {tour.emergencyContact?.phone}
								</p>
							)}
						</div>

						{/* Status Info */}
						{(tour.checkedIn || tour.checkedOut) && (
							<div
								style={{
									backgroundColor: "#f0fdf4",
									border: "1px solid #bbf7d0",
									padding: "12px",
									borderRadius: "6px",
									marginTop: "10px",
								}}
							>
								<h4
									style={{
										margin: "0 0 8px 0",
										fontSize: "14px",
										fontWeight: "600",
										color: "#15803d",
									}}
								>
									Check-in/Check-out Status
								</h4>
								{tour.checkedIn && (
									<p
										style={{
											margin: "4px 0",
											fontSize: "13px",
											color: "#166534",
										}}
									>
										✅ Check-in:{" "}
										{tour.checkinTime
											? formatDate(tour.checkinTime)
											: "Zeit nicht verfügbar"}
									</p>
								)}
								{tour.checkedOut && (
									<p
										style={{
											margin: "4px 0",
											fontSize: "13px",
											color: "#166534",
										}}
									>
										🏁 Check-out:{" "}
										{tour.checkoutTime
											? formatDate(tour.checkoutTime)
											: "Zeit nicht verfügbar"}
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TourDetailModal;
