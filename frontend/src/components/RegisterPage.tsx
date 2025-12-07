import React, { useState } from "react";

interface RegisterPageProps {
	onRegister: (
		email: string,
		password: string,
		name: string,
		confirmPassword: string
	) => void;
	onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
	onRegister,
	onSwitchToLogin,
}) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		// Name validation
		if (!formData.name.trim()) {
			newErrors.name = "Name ist erforderlich";
		} else if (formData.name.trim().length < 2) {
			newErrors.name = "Name muss mindestens 2 Zeichen lang sein";
		}

		// Email validation
		if (!formData.email) {
			newErrors.email = "E-Mail ist erforderlich";
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
		) {
			newErrors.email = "Ungültige E-Mail-Adresse";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Passwort ist erforderlich";
		} else if (formData.password.length < 6) {
			newErrors.password = "Passwort muss mindestens 6 Zeichen lang sein";
		} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
			newErrors.password =
				"Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten";
		}

		// Confirm password validation
		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Passwort bestätigen ist erforderlich";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwörter stimmen nicht überein";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			onRegister(
				formData.email,
				formData.password,
				formData.name,
				formData.confirmPassword
			);
		} catch (error) {
			console.error("Registration failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: "",
			}));
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				padding: "20px",
			}}
		>
			<div
				style={{
					maxWidth: "450px",
					width: "100%",
					backgroundColor: "white",
					borderRadius: "12px",
					padding: "40px",
					boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
				}}
			>
				<div style={{ textAlign: "center", marginBottom: "32px" }}>
					<h1
						style={{
							fontSize: "2rem",
							fontWeight: "bold",
							color: "#1f2937",
							marginBottom: "8px",
						}}
					>
						🏔️ TourGuard
					</h1>
					<p style={{ color: "#6b7280" }}>Neues Konto erstellen</p>
				</div>

				<form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
					{/* Name Field */}
					<div style={{ marginBottom: "20px" }}>
						<label
							style={{
								display: "block",
								fontSize: "14px",
								fontWeight: "500",
								color: "#374151",
								marginBottom: "6px",
							}}
						>
							Vollständiger Name *
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							placeholder="Max Mustermann"
							style={{
								width: "100%",
								padding: "12px 16px",
								border: errors.name ? "1px solid #dc2626" : "1px solid #d1d5db",
								borderRadius: "6px",
								fontSize: "14px",
								outline: "none",
								transition: "border-color 0.2s",
								backgroundColor: errors.name ? "#fef2f2" : "white",
							}}
							onFocus={(e) => {
								if (!errors.name) {
									e.target.style.borderColor = "#3b82f6";
								}
							}}
							onBlur={(e) => {
								if (!errors.name) {
									e.target.style.borderColor = "#d1d5db";
								}
							}}
						/>
						{errors.name && (
							<p
								style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}
							>
								{errors.name}
							</p>
						)}
					</div>

					{/* Email Field */}
					<div style={{ marginBottom: "20px" }}>
						<label
							style={{
								display: "block",
								fontSize: "14px",
								fontWeight: "500",
								color: "#374151",
								marginBottom: "6px",
							}}
						>
							E-Mail-Adresse *
						</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							placeholder="ihre@email.com"
							style={{
								width: "100%",
								padding: "12px 16px",
								border: errors.email
									? "1px solid #dc2626"
									: "1px solid #d1d5db",
								borderRadius: "6px",
								fontSize: "14px",
								outline: "none",
								transition: "border-color 0.2s",
								backgroundColor: errors.email ? "#fef2f2" : "white",
							}}
							onFocus={(e) => {
								if (!errors.email) {
									e.target.style.borderColor = "#3b82f6";
								}
							}}
							onBlur={(e) => {
								if (!errors.email) {
									e.target.style.borderColor = "#d1d5db";
								}
							}}
						/>
						{errors.email && (
							<p
								style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}
							>
								{errors.email}
							</p>
						)}
					</div>

					{/* Password Field */}
					<div style={{ marginBottom: "20px" }}>
						<label
							style={{
								display: "block",
								fontSize: "14px",
								fontWeight: "500",
								color: "#374151",
								marginBottom: "6px",
							}}
						>
							Passwort *
						</label>
						<input
							type="password"
							value={formData.password}
							onChange={(e) => handleInputChange("password", e.target.value)}
							placeholder="••••••••"
							style={{
								width: "100%",
								padding: "12px 16px",
								border: errors.password
									? "1px solid #dc2626"
									: "1px solid #d1d5db",
								borderRadius: "6px",
								fontSize: "14px",
								outline: "none",
								transition: "border-color 0.2s",
								backgroundColor: errors.password ? "#fef2f2" : "white",
							}}
							onFocus={(e) => {
								if (!errors.password) {
									e.target.style.borderColor = "#3b82f6";
								}
							}}
							onBlur={(e) => {
								if (!errors.password) {
									e.target.style.borderColor = "#d1d5db";
								}
							}}
						/>
						{errors.password && (
							<p
								style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}
							>
								{errors.password}
							</p>
						)}
						<p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
							Mind. 6 Zeichen, mit Groß-/Kleinbuchstaben und Zahl
						</p>
					</div>

					{/* Confirm Password Field */}
					<div style={{ marginBottom: "24px" }}>
						<label
							style={{
								display: "block",
								fontSize: "14px",
								fontWeight: "500",
								color: "#374151",
								marginBottom: "6px",
							}}
						>
							Passwort bestätigen *
						</label>
						<input
							type="password"
							value={formData.confirmPassword}
							onChange={(e) =>
								handleInputChange("confirmPassword", e.target.value)
							}
							placeholder="••••••••"
							style={{
								width: "100%",
								padding: "12px 16px",
								border: errors.confirmPassword
									? "1px solid #dc2626"
									: "1px solid #d1d5db",
								borderRadius: "6px",
								fontSize: "14px",
								outline: "none",
								transition: "border-color 0.2s",
								backgroundColor: errors.confirmPassword ? "#fef2f2" : "white",
							}}
							onFocus={(e) => {
								if (!errors.confirmPassword) {
									e.target.style.borderColor = "#3b82f6";
								}
							}}
							onBlur={(e) => {
								if (!errors.confirmPassword) {
									e.target.style.borderColor = "#d1d5db";
								}
							}}
						/>
						{errors.confirmPassword && (
							<p
								style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px" }}
							>
								{errors.confirmPassword}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={isLoading}
						style={{
							width: "100%",
							backgroundColor: isLoading ? "#9ca3af" : "#3b82f6",
							color: "white",
							padding: "12px",
							border: "none",
							borderRadius: "6px",
							fontSize: "16px",
							fontWeight: "500",
							cursor: isLoading ? "not-allowed" : "pointer",
							transition: "background-color 0.2s",
						}}
						onMouseOver={(e) => {
							if (!isLoading) {
								e.currentTarget.style.backgroundColor = "#2563eb";
							}
						}}
						onMouseOut={(e) => {
							if (!isLoading) {
								e.currentTarget.style.backgroundColor = "#3b82f6";
							}
						}}
					>
						{isLoading ? "🔄 Wird erstellt..." : "Konto erstellen"}
					</button>
				</form>

				<div style={{ textAlign: "center" }}>
					<p style={{ color: "#6b7280", fontSize: "14px" }}>
						Bereits ein Konto?{" "}
						<button
							onClick={onSwitchToLogin}
							style={{
								color: "#3b82f6",
								background: "none",
								border: "none",
								cursor: "pointer",
								textDecoration: "underline",
								fontSize: "14px",
							}}
						>
							Hier anmelden
						</button>
					</p>
				</div>

				{/* Info Section */}
				<div
					style={{
						marginTop: "30px",
						padding: "16px",
						backgroundColor: "#f0f9ff",
						borderRadius: "6px",
					}}
				>
					<h4
						style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#1e40af" }}
					>
						🛡️ Ihre Sicherheit ist uns wichtig
					</h4>
					<ul
						style={{
							margin: 0,
							paddingLeft: "20px",
							color: "#1e40af",
							fontSize: "12px",
						}}
					>
						<li>Sichere Passwort-Verschlüsselung</li>
						<li>Datenschutz nach DSGVO-Standards</li>
						<li>Notfallkontakte werden sicher gespeichert</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
