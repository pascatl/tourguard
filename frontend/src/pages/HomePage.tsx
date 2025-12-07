import { Link } from "react-router-dom";
import {
	Mountain,
	Shield,
	Navigation,
	Users,
	Phone,
	MapPin,
} from "lucide-react";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-mountain-50 to-primary-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-mountain-200">
				<div className="container mx-auto px-6 py-4">
					<nav className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Mountain className="h-8 w-8 text-primary-600" />
							<h1 className="text-2xl font-bold text-mountain-900">
								TourGuard
							</h1>
						</div>
						<div className="flex space-x-4">
							<Link to="/login" className="btn btn-secondary">
								Anmelden
							</Link>
							<Link to="/register" className="btn btn-primary">
								Registrieren
							</Link>
						</div>
					</nav>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-6">
				<div className="container mx-auto text-center">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-5xl font-bold text-mountain-900 mb-6">
							Sicherheit für deine
							<span className="text-primary-600 block mt-2">Bergtouren</span>
						</h1>
						<p className="text-xl text-mountain-600 mb-8 max-w-2xl mx-auto">
							TourGuard ist dein digitaler Sicherheitsbegleiter für Bergtouren.
							Plane deine Route, teile wichtige Informationen und sorge für
							automatische Benachrichtigungen im Notfall.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								to="/register"
								className="btn btn-primary text-lg px-8 py-3"
							>
								Jetzt kostenlos starten
							</Link>
							<Link
								to="#features"
								className="btn btn-secondary text-lg px-8 py-3"
							>
								Mehr erfahren
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 px-6 bg-white">
				<div className="container mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-mountain-900 mb-4">
							Alles was du für sichere Bergtouren brauchst
						</h2>
						<p className="text-lg text-mountain-600 max-w-2xl mx-auto">
							Von der Routenplanung bis zur automatischen
							Notfallbenachrichtigung - TourGuard denkt an alles, damit du dich
							aufs Wandern konzentrieren kannst.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Feature 1 */}
						<div className="card text-center">
							<div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<MapPin className="h-8 w-8 text-primary-600" />
							</div>
							<h3 className="text-xl font-semibold text-mountain-900 mb-3">
								Routenplanung
							</h3>
							<p className="text-mountain-600">
								Erstelle Routen mit interaktiven Karten, importiere GPX-Dateien
								oder setze Wegpunkte manuell. Alles übersichtlich in einer App.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="card text-center">
							<div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<Shield className="h-8 w-8 text-green-600" />
							</div>
							<h3 className="text-xl font-semibold text-mountain-900 mb-3">
								Check-In/Out System
							</h3>
							<p className="text-mountain-600">
								Starte deine Tour mit Check-In und vergiss nie wieder den
								Check-Out. Das System überwacht automatisch deine geplante
								Rückkehrzeit.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="card text-center">
							<div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<Phone className="h-8 w-8 text-red-600" />
							</div>
							<h3 className="text-xl font-semibold text-mountain-900 mb-3">
								Automatische Benachrichtigung
							</h3>
							<p className="text-mountain-600">
								Bei verspätetem Check-Out werden deine Notfallkontakte
								automatisch per SMS informiert - mit allen wichtigen
								Tourinformationen.
							</p>
						</div>

						{/* Feature 4 */}
						<div className="card text-center">
							<div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<Users className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="text-xl font-semibold text-mountain-900 mb-3">
								Teilnehmerverwaltung
							</h3>
							<p className="text-mountain-600">
								Verwalte alle Tournteilnehmer mit wichtigen Informationen wie
								Erfahrungslevel und medizinischen Hinweisen an einem Ort.
							</p>
						</div>

						{/* Feature 5 */}
						<div className="card text-center">
							<div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<Navigation className="h-8 w-8 text-yellow-600" />
							</div>
							<h3 className="text-xl font-semibold text-mountain-900 mb-3">
								Ausrüstungsliste
							</h3>
							<p className="text-mountain-600">
								Dokumentiere deine mitgeführte Ausrüstung. Im Notfall wissen
								Retter sofort, welche Hilfsmittel verfügbar sind.
							</p>
						</div>

						{/* Feature 6 */}
						<div className="card text-center">
							<div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
								<Mountain className="h-8 w-8 text-purple-600" />
							</div>
							<h3 className="text-xl font-semibold text-mountain-900 mb-3">
								Notfalldaten
							</h3>
							<p className="text-mountain-600">
								Alle wichtigen Informationen für Rettungskräfte sind sofort
								verfügbar - Route, Teilnehmer, Ausrüstung und Kontakte.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-6 bg-primary-600 text-white">
				<div className="container mx-auto text-center">
					<h2 className="text-3xl font-bold mb-4">
						Bereit für deine erste sichere Bergtour?
					</h2>
					<p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
						Registriere dich kostenlos und plane deine nächste Bergtour mit dem
						Sicherheitsnetz, das du verdienst.
					</p>
					<Link
						to="/register"
						className="btn bg-white text-primary-600 hover:bg-mountain-50 text-lg px-8 py-3"
					>
						Kostenlos registrieren
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-mountain-900 text-white py-12 px-6">
				<div className="container mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center space-x-3 mb-4 md:mb-0">
							<Mountain className="h-8 w-8 text-primary-400" />
							<span className="text-xl font-bold">TourGuard</span>
						</div>
						<div className="text-mountain-400 text-center md:text-right">
							<p>&copy; 2024 TourGuard. Alle Rechte vorbehalten.</p>
							<p className="mt-1">
								Sicherheit für Bergliebhaber, von Bergliebhabern.
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
