import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TourFormPage from "./pages/TourFormPage";
import "./styles.css";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export default function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="App">
					<Routes>
						{/* Public Routes */}
						<Route
							path="/login"
							element={
								<PublicRoute>
									<LoginPage />
								</PublicRoute>
							}
						/>
						<Route
							path="/register"
							element={
								<PublicRoute>
									<RegisterPage />
								</PublicRoute>
							}
						/>

						{/* Protected Routes */}
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<DashboardPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/tours/new"
							element={
								<ProtectedRoute>
									<TourFormPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/tours/:id/edit"
							element={
								<ProtectedRoute>
									<TourFormPage />
								</ProtectedRoute>
							}
						/>

						{/* Default redirect */}
						<Route path="/" element={<Navigate to="/dashboard" replace />} />
						<Route path="*" element={<Navigate to="/dashboard" replace />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}
