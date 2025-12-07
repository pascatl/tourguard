import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import TourCreatePage from "./pages/TourCreatePage";
import ImprintPage from "./pages/ImprintPage";
import Footer from "./components/Footer";
import { ToastService } from "./services/toastService";

type Page = "login" | "register" | "dashboard" | "create-tour" | "imprint";

// Inner App component that uses AuthContext
function AppContent() {
	const { user, login, register, logout } = useAuth();
	const [currentPage, setCurrentPage] = useState<Page>("login");
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleLogin = async (email: string, password: string) => {
		try {
			await login({ email, password });
			ToastService.success(`Willkommen zurück!`);
			setCurrentPage("dashboard");
		} catch (error: any) {
			ToastService.error(
				error.message ||
					"Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Eingaben."
			);
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
			ToastService.success(
				`🎉 Willkommen bei TourGuard, ${name}!\nIhr Konto wurde erfolgreich erstellt.`
			);
			setCurrentPage("dashboard");
		} catch (error: any) {
			ToastService.error(
				error.message ||
					"Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut."
			);
		}
	};

	const handleSwitchToRegister = () => {
		setCurrentPage("register");
	};

	const handleSwitchToLogin = () => {
		setCurrentPage("login");
	};

	const handleCreateTour = () => {
		setCurrentPage("create-tour");
	};

	const handleTourCreated = (tour: any) => {
		ToastService.success(
			`Tour "${tour?.name || "Neue Tour"}" wurde erfolgreich erstellt!`
		);
		setRefreshTrigger((prev) => prev + 1); // Trigger Dashboard refresh
		setCurrentPage("dashboard");
	};

	const handleCancelTourCreate = () => {
		setCurrentPage("dashboard");
	};

	const handleNavigateToImprint = () => {
		setCurrentPage("imprint");
	};

	const handleBackFromImprint = () => {
		// Gehe zurück zur vorherigen Seite oder Dashboard
		setCurrentPage(user ? "dashboard" : "login");
	};

	if (currentPage === "imprint") {
		return <ImprintPage onBack={handleBackFromImprint} />;
	}

	if (currentPage === "login" && !user) {
		return (
			<div
				style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
			>
				<div style={{ flex: 1 }}>
					<LoginPage
						onLogin={handleLogin}
						onSwitchToRegister={handleSwitchToRegister}
					/>
				</div>
				<Footer onNavigateToImprint={handleNavigateToImprint} />
			</div>
		);
	}

	if (currentPage === "register" && !user) {
		return (
			<div
				style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
			>
				<div style={{ flex: 1 }}>
					<RegisterPage
						onRegister={handleRegister}
						onSwitchToLogin={handleSwitchToLogin}
					/>
				</div>
				<Footer onNavigateToImprint={handleNavigateToImprint} />
			</div>
		);
	}

	if (currentPage === "create-tour" && user) {
		return (
			<div
				style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
			>
				<div style={{ flex: 1 }}>
					<TourCreatePage
						onTourCreated={handleTourCreated}
						onCancel={handleCancelTourCreate}
					/>
				</div>
				<Footer onNavigateToImprint={handleNavigateToImprint} />
			</div>
		);
	}

	if ((currentPage === "dashboard" && user) || user) {
		return (
			<div
				style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
			>
				<div style={{ flex: 1 }}>
					<DashboardPage
						user={{ name: user.name, email: user.email }}
						onLogout={handleLogout}
						onCreateTour={handleCreateTour}
						refreshTrigger={refreshTrigger}
					/>
				</div>
				<Footer onNavigateToImprint={handleNavigateToImprint} />
			</div>
		);
	}

	return <div>Fehler: Unbekannte Seite</div>;
}

// Main App component with AuthProvider
function App() {
	return (
		<AuthProvider>
			<AppContent />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</AuthProvider>
	);
}

export default App;
