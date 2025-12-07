import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";

type Page = "login" | "register" | "dashboard";

interface User {
	name: string;
	email: string;
}

function App() {
	const [currentPage, setCurrentPage] = useState<Page>("login");
	const [user, setUser] = useState<User | null>(null);

	const handleLogin = (email: string, password: string) => {
		// Einfache Demo-Anmeldung
		if (email === "demo@tourguard.de" && password === "demo123") {
			setUser({
				name: "Demo Benutzer",
				email: email,
			});
			setCurrentPage("dashboard");
		} else {
			alert(
				"Ungültige Anmeldedaten. Verwenden Sie:\nE-Mail: demo@tourguard.de\nPasswort: demo123"
			);
		}
	};

	const handleLogout = () => {
		setUser(null);
		setCurrentPage("login");
	};

	const handleRegister = (
		email: string,
		password: string,
		name: string,
		confirmPassword: string
	) => {
		// Validierung der Registrierungsdaten
		if (password !== confirmPassword) {
			alert("Passwörter stimmen nicht überein!");
			return;
		}

		// Passwort-Stärke prüfen
		if (password.length < 8) {
			alert("Das Passwort muss mindestens 8 Zeichen lang sein!");
			return;
		}

		// E-Mail-Format prüfen
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			alert("Bitte geben Sie eine gültige E-Mail-Adresse ein!");
			return;
		}

		// Speichere den neuen Benutzer (in einer echten App würde dies an das Backend gesendet)
		const newUser = {
			name: name,
			email: email,
		};

		setUser(newUser);
		setCurrentPage("dashboard");

		alert(
			`🎉 Willkommen bei TourGuard, ${name}!\nIhr Konto wurde erfolgreich erstellt.`
		);
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

	if (currentPage === "login") {
		return (
			<LoginPage
				onLogin={handleLogin}
				onSwitchToRegister={handleSwitchToRegister}
			/>
		);
	}

	if (currentPage === "register") {
		return (
			<RegisterPage
				onRegister={handleRegister}
				onSwitchToLogin={handleSwitchToLogin}
			/>
		);
	}

	if (currentPage === "dashboard" && user) {
		return (
			<DashboardPage
				user={user}
				onLogout={handleLogout}
				onCreateTour={handleCreateTour}
			/>
		);
	}

	return <div>Fehler: Unbekannte Seite</div>;
}

export default App;
