import React, { useState } from "react";
import { tourService } from "../services/api";
import { Tour } from "../types/api";

interface TourCreatePageProps {
	onTourCreated?: (tour: Tour) => void;
	onCancel?: () => void;
}

const TourCreatePage: React.FC<TourCreatePageProps> = ({
	onTourCreated,
	onCancel,
}) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		startLocation: "",
		endLocation: "",
		startTime: "",
		expectedEndTime: "",
		emergencyContactName: "",
		emergencyContactPhone: "",
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Tour-Name ist erforderlich";
		}

		if (!formData.startLocation.trim()) {
			newErrors.startLocation = "Startort ist erforderlich";
		}

		if (!formData.startTime) {
			newErrors.startTime = "Geplante Startzeit ist erforderlich";
		}

		if (!formData.expectedEndTime) {
			newErrors.expectedEndTime = "Geplante Endzeit ist erforderlich";
		}

		if (formData.startTime && formData.expectedEndTime) {
			const startTime = new Date(formData.startTime);
			const endTime = new Date(formData.expectedEndTime);

			if (endTime <= startTime) {
				newErrors.expectedEndTime = "Endzeit muss nach der Startzeit liegen";
			}

			if (startTime < new Date()) {
				newErrors.startTime = "Startzeit muss in der Zukunft liegen";
			}
		}

		if (!formData.emergencyContactName.trim()) {
			newErrors.emergencyContactName = "Notfallkontakt-Name ist erforderlich";
		}

		if (!formData.emergencyContactPhone.trim()) {
			newErrors.emergencyContactPhone =
				"Notfallkontakt-Telefon ist erforderlich";
		} else if (!/^[\+]?[0-9\-\s\(\)]+$/.test(formData.emergencyContactPhone)) {
			newErrors.emergencyContactPhone = "Ungültiges Telefonformat";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			const tourData = {
				name: formData.name,
				description: formData.description,
				startLocation: formData.startLocation,
				endLocation: formData.endLocation,
				startTime: formData.startTime,
				expectedEndTime: formData.expectedEndTime,
				emergencyContact: {
					name: formData.emergencyContactName,
					phone: formData.emergencyContactPhone,
				},
			};

			const newTour = await tourService.createTour(tourData);

			alert(`🎉 Tour "${newTour.name}" wurde erfolgreich erstellt!`);

			if (onTourCreated) {
				onTourCreated(newTour);
			}

			// Reset form
			setFormData({
				name: "",
				description: "",
				startLocation: "",
				endLocation: "",
				startTime: "",
				expectedEndTime: "",
				emergencyContactName: "",
				emergencyContactPhone: "",
			});
		} catch (error: any) {
			console.error("Fehler beim Erstellen der Tour:", error);
			alert(
				"Fehler beim Erstellen der Tour: " +
					(error.response?.data?.error || error.message || "Unbekannter Fehler")
			);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				backgroundColor: "#f9fafb",
				padding: "20px",
			}}
		>
			<div
				style={{
					maxWidth: "600px",
					margin: "0 auto",
					backgroundColor: "white",
					borderRadius: "12px",
					padding: "30px",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				}}
			>
				<h1
					style={{
						fontSize: "2rem",
						fontWeight: "bold",
						color: "#1f2937",
						marginBottom: "30px",
						textAlign: "center",
					}}
				>
					🏔️ Neue Tour erstellen
				</h1>

				<form onSubmit={handleSubmit}>
					{/* Tour Name */}
					<div style={{ marginBottom: "20px" }}>
						<label
							style={{
								display: "block",
								fontWeight: "600",
								marginBottom: "8px",
								color: "#374151",
							}}
						>
							Tour-Name *
						</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="z.B. Zugspitze über Höllental"
							style={{
								width: "100%",
								padding: "12px",
								border: `2px solid ${errors.name ? "#ef4444" : "#d1d5db"}`,
								borderRadius: "8px",
								fontSize: "16px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
						/>
						{errors.name && (
							<span style={{ color: "#ef4444", fontSize: "14px" }}>
								{errors.name}
							</span>
						)}
					</div>

					{/* Description */}
					<div style={{ marginBottom: "20px" }}>
						<label
							style={{
								display: "block",
								fontWeight: "600",
								marginBottom: "8px",
								color: "#374151",
							}}
						>
							Beschreibung
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							placeholder="Beschreibung der Tour (optional)"
							rows={3}
							style={{
								width: "100%",
								padding: "12px",
								border: "2px solid #d1d5db",
								borderRadius: "8px",
								fontSize: "16px",
								outline: "none",
								transition: "border-color 0.2s",
								resize: "vertical",
							}}
						/>
					</div>

					{/* Start Location */}
					<div style={{ marginBottom: "20px" }}>
						<label
							style={{
								display: "block",
								fontWeight: "600",
								marginBottom: "8px",
								color: "#374151",
							}}
						>
							Startort *
						</label>
						<input
							type="text"
							name="startLocation"
							value={formData.startLocation}
							onChange={handleChange}
							placeholder="z.B. Hammersbach, Bayern"
							style={{
								width: "100%",
								padding: "12px",
								border: `2px solid ${
									errors.startLocation ? "#ef4444" : "#d1d5db"
								}`,
								borderRadius: "8px",
								fontSize: "16px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
						/>
						{errors.startLocation && (
							<span style={{ color: "#ef4444", fontSize: "14px" }}>
								{errors.startLocation}
							</span>
						)}
					</div>

					{/* End Location */}
					<div style={{ marginBottom: "20px" }}>
						<label
							style={{
								display: "block",
								fontWeight: "600",
								marginBottom: "8px",
								color: "#374151",
							}}
						>
							Zielort
						</label>
						<input
							type="text"
							name="endLocation"
							value={formData.endLocation}
							onChange={handleChange}
							placeholder="z.B. Zugspitze Gipfel (optional)"
							style={{
								width: "100%",
								padding: "12px",
								border: "2px solid #d1d5db",
								borderRadius: "8px",
								fontSize: "16px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
						/>
					</div>

					{/* Time Fields */}
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "20px",
							marginBottom: "20px",
						}}
					>
						<div>
							<label
								style={{
									display: "block",
									fontWeight: "600",
									marginBottom: "8px",
									color: "#374151",
								}}
							>
								Geplante Startzeit *
							</label>
							<input
								type="datetime-local"
								name="startTime"
								value={formData.startTime}
								onChange={handleChange}
								style={{
									width: "100%",
									padding: "12px",
									border: `2px solid ${
										errors.startTime ? "#ef4444" : "#d1d5db"
									}`,
									borderRadius: "8px",
									fontSize: "16px",
									outline: "none",
									transition: "border-color 0.2s",
								}}
							/>
							{errors.startTime && (
								<span style={{ color: "#ef4444", fontSize: "14px" }}>
									{errors.startTime}
								</span>
							)}
						</div>

						<div>
							<label
								style={{
									display: "block",
									fontWeight: "600",
									marginBottom: "8px",
									color: "#374151",
								}}
							>
								Geplante Endzeit *
							</label>
							<input
								type="datetime-local"
								name="expectedEndTime"
								value={formData.expectedEndTime}
								onChange={handleChange}
								style={{
									width: "100%",
									padding: "12px",
									border: `2px solid ${
										errors.expectedEndTime ? "#ef4444" : "#d1d5db"
									}`,
									borderRadius: "8px",
									fontSize: "16px",
									outline: "none",
									transition: "border-color 0.2s",
								}}
							/>
							{errors.expectedEndTime && (
								<span style={{ color: "#ef4444", fontSize: "14px" }}>
									{errors.expectedEndTime}
								</span>
							)}
						</div>
					</div>

					{/* Emergency Contact */}
					<div style={{ marginBottom: "20px" }}>
						<label
							style={{
								display: "block",
								fontWeight: "600",
								marginBottom: "8px",
								color: "#374151",
							}}
						>
							Notfallkontakt Name *
						</label>
						<input
							type="text"
							name="emergencyContactName"
							value={formData.emergencyContactName}
							onChange={handleChange}
							placeholder="Name des Notfallkontakts"
							style={{
								width: "100%",
								padding: "12px",
								border: `2px solid ${
									errors.emergencyContactName ? "#ef4444" : "#d1d5db"
								}`,
								borderRadius: "8px",
								fontSize: "16px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
						/>
						{errors.emergencyContactName && (
							<span style={{ color: "#ef4444", fontSize: "14px" }}>
								{errors.emergencyContactName}
							</span>
						)}
					</div>

					<div style={{ marginBottom: "30px" }}>
						<label
							style={{
								display: "block",
								fontWeight: "600",
								marginBottom: "8px",
								color: "#374151",
							}}
						>
							Notfallkontakt Telefon *
						</label>
						<input
							type="tel"
							name="emergencyContactPhone"
							value={formData.emergencyContactPhone}
							onChange={handleChange}
							placeholder="01701234567"
							style={{
								width: "100%",
								padding: "12px",
								border: `2px solid ${
									errors.emergencyContactPhone ? "#ef4444" : "#d1d5db"
								}`,
								borderRadius: "8px",
								fontSize: "16px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
						/>
						{errors.emergencyContactPhone && (
							<span style={{ color: "#ef4444", fontSize: "14px" }}>
								{errors.emergencyContactPhone}
							</span>
						)}
					</div>

					{/* Buttons */}
					<div
						style={{
							display: "flex",
							gap: "15px",
							justifyContent: "center",
						}}
					>
						{onCancel && (
							<button
								type="button"
								onClick={onCancel}
								style={{
									padding: "12px 24px",
									backgroundColor: "#6b7280",
									color: "white",
									border: "none",
									borderRadius: "8px",
									fontSize: "16px",
									fontWeight: "600",
									cursor: "pointer",
									transition: "background-color 0.2s",
								}}
							>
								Abbrechen
							</button>
						)}

						<button
							type="submit"
							disabled={loading}
							style={{
								padding: "12px 24px",
								backgroundColor: loading ? "#9ca3af" : "#3b82f6",
								color: "white",
								border: "none",
								borderRadius: "8px",
								fontSize: "16px",
								fontWeight: "600",
								cursor: loading ? "not-allowed" : "pointer",
								transition: "background-color 0.2s",
							}}
						>
							{loading ? "Wird erstellt..." : "Tour erstellen"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TourCreatePage;
