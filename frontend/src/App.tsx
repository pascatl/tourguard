import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";

type Page = "login" | "register" | "dashboard";

// Inner App component that uses AuthContext
function AppContent() {
	const { user, login, register, logout } = useAuth();
	const [currentPage, setCurrentPage] = useState<Page>("login");

	const handleLogin = async (email: string, password: string) => {
		try {
			await login({ email, password });
			setCurrentPage("dashboard");
		} catch (error: any) {
			alert(error.message || "Anmeldung fehlgeschlagen");
		}
	};

	const handleLogout = () => {
		logout();
		setCurrentPage("login");
	};

	const handleRegister = async (
		email: string,
		password: string,
		name: string,
		confirmPassword: string
	) => {
		// Frontend-Validierung
		if (password !== confirmPassword) {
			alert("Passwörter stimmen nicht überein!");
			return;
		}

		if (password.length < 6) {
			alert("Das Passwort muss mindestens 6 Zeichen lang sein!");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			alert("Bitte geben Sie eine gültige E-Mail-Adresse ein!");
			return;
		}

		try {
			await register({ email, password, name });
			setCurrentPage("dashboard");
			alert(
				`🎉 Willkommen bei TourGuard, ${name}!\nIhr Konto wurde erfolgreich erstellt.`
			);
		} catch (error: any) {
			alert(error.message || "Registrierung fehlgeschlagen");
		}
	};

	const handleSwitchToRegister = () => {
		setCurrentPage("register");
	};

	const handleSwitchToLogin = () => {
		setCurrentPage("login");
	};

	const handleCreateTour = () => {
		alert("Tour-Erstellung wird implementiert! 🏔️");
	};

	if (currentPage === "login" && !user) {
		return (
			<LoginPage
				onLogin={handleLogin}
				onSwitchToRegister={handleSwitchToRegister}
			/>
		);
	}

	if (currentPage === "register" && !user) {
		return (
			<RegisterPage
				onRegister={handleRegister}
				onSwitchToLogin={handleSwitchToLogin}
			/>
		);
	}

	if ((currentPage === "dashboard" && user) || user) {
		return (
			<DashboardPage
				user={{ name: user.name, email: user.email }}
				onLogout={handleLogout}
				onCreateTour={handleCreateTour}
			/>
		);
	}

	return <div>Fehler: Unbekannte Seite</div>;
}

// Main App component with AuthProvider
function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
}

export default App;
