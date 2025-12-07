import React, { useState } from "react";

interface LoginPageProps {
	onLogin: (email: string, password: string) => void;
	onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
	onLogin,
	onSwitchToRegister,
}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			setError("Bitte füllen Sie alle Felder aus.");
			return;
		}
		setError("");
		onLogin(email, password);
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
					maxWidth: "400px",
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
					<p style={{ color: "#6b7280" }}>Bei Ihrem Konto anmelden</p>
				</div>

				{error && (
					<div
						style={{
							backgroundColor: "#fef2f2",
							border: "1px solid #fca5a5",
							color: "#dc2626",
							padding: "12px",
							borderRadius: "6px",
							marginBottom: "20px",
							fontSize: "14px",
						}}
					>
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
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
							E-Mail-Adresse
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="ihre@email.com"
							style={{
								width: "100%",
								padding: "12px 16px",
								border: "1px solid #d1d5db",
								borderRadius: "6px",
								fontSize: "14px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
							onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
							onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
						/>
					</div>

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
							Passwort
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							style={{
								width: "100%",
								padding: "12px 16px",
								border: "1px solid #d1d5db",
								borderRadius: "6px",
								fontSize: "14px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
							onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
							onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
						/>
					</div>

					<button
						type="submit"
						style={{
							width: "100%",
							backgroundColor: "#3b82f6",
							color: "white",
							padding: "12px",
							border: "none",
							borderRadius: "6px",
							fontSize: "16px",
							fontWeight: "500",
							cursor: "pointer",
							transition: "background-color 0.2s",
						}}
						onMouseOver={(e) =>
							(e.currentTarget.style.backgroundColor = "#2563eb")
						}
						onMouseOut={(e) =>
							(e.currentTarget.style.backgroundColor = "#3b82f6")
						}
					>
						Anmelden
					</button>
				</form>

				<div style={{ textAlign: "center" }}>
					<p style={{ color: "#6b7280", fontSize: "14px" }}>
						Noch kein Konto?{" "}
						<button
							onClick={onSwitchToRegister}
							style={{
								color: "#3b82f6",
								background: "none",
								border: "none",
								cursor: "pointer",
								textDecoration: "underline",
								fontSize: "14px",
							}}
						>
							Hier registrieren
						</button>
					</p>
				</div>

				<div
					style={{
						marginTop: "30px",
						padding: "16px",
						backgroundColor: "#f3f4f6",
						borderRadius: "6px",
					}}
				>
					<p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
						Demo-Anmeldedaten:
					</p>
					<p
						style={{ fontSize: "12px", color: "#374151", margin: "4px 0 0 0" }}
					>
						E-Mail: demo@tourguard.de
						<br />
						Passwort: demo123
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
