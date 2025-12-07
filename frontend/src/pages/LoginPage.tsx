import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginData } from "../types";
import toast from "react-hot-toast";
import { Mountain, Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [formData, setFormData] = useState<LoginData>({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await login(formData);
			toast.success("Erfolgreich angemeldet!");
			navigate("/dashboard");
		} catch (error: any) {
			toast.error(error.message || "Anmeldung fehlgeschlagen");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-mountain-50 to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<Link
						to="/"
						className="flex items-center justify-center space-x-3 mb-8"
					>
						<Mountain className="h-10 w-10 text-primary-600" />
						<h1 className="text-3xl font-bold text-mountain-900">TourGuard</h1>
					</Link>
					<h2 className="text-2xl font-semibold text-mountain-900">
						Anmeldung
					</h2>
					<p className="mt-2 text-mountain-600">
						Melde dich an, um deine Bergtouren zu verwalten
					</p>
				</div>

				{/* Login Form */}
				<div className="card">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-mountain-700 mb-2"
							>
								E-Mail-Adresse
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-mountain-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									required
									value={formData.email}
									onChange={handleChange}
									className="input pl-10"
									placeholder="deine@email.de"
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-mountain-700 mb-2"
							>
								Passwort
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-mountain-400" />
								</div>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									value={formData.password}
									onChange={handleChange}
									className="input pl-10 pr-10"
									placeholder="Dein Passwort"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-mountain-400 hover:text-mountain-600" />
									) : (
										<Eye className="h-5 w-5 text-mountain-400 hover:text-mountain-600" />
									)}
								</button>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="btn btn-primary w-full flex items-center justify-center space-x-2"
						>
							{loading ? (
								<>
									<div className="spinner"></div>
									<span>Anmeldung läuft...</span>
								</>
							) : (
								<span>Anmelden</span>
							)}
						</button>
					</form>

					{/* Register Link */}
					<div className="mt-6 text-center">
						<p className="text-mountain-600">
							Noch kein Konto?{" "}
							<Link
								to="/register"
								className="text-primary-600 hover:text-primary-700 font-medium"
							>
								Jetzt registrieren
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
