import React from "react";
import { useAuth } from "../contexts/AuthContext";

const DashboardPage: React.FC = () => {
	const { user } = useAuth();

	return (
		<div className="p-6">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl font-bold text-mountain-900 mb-6">
					Willkommen zurück, {user?.name}!
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="card">
						<h2 className="text-lg font-semibold mb-4">Aktuelle Touren</h2>
						<p className="text-mountain-600">Keine aktiven Touren</p>
					</div>

					<div className="card">
						<h2 className="text-lg font-semibold mb-4">Geplante Touren</h2>
						<p className="text-mountain-600">Keine geplanten Touren</p>
					</div>

					<div className="card">
						<h2 className="text-lg font-semibold mb-4">Schnellstart</h2>
						<button className="btn btn-primary w-full">
							Neue Tour erstellen
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
