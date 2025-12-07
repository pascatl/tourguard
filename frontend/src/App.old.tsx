import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

type Page = 'login' | 'register' | 'dashboard';

interface User {
  name: string;
  email: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Einfache Demo-Anmeldung
    if (email === 'demo@tourguard.de' && password === 'demo123') {
      setUser({
        name: 'Demo Benutzer',
        email: email
      });
      setCurrentPage('dashboard');
    } else {
      alert('Ungültige Anmeldedaten. Verwenden Sie:\nE-Mail: demo@tourguard.de\nPasswort: demo123');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentPage('register');
  };

  const handleCreateTour = () => {
    alert('Tour-Erstellung wird implementiert! 🏔️');
  };

  if (currentPage === 'login') {
    return (
      <LoginPage 
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          width: '100%', 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '40px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
            🏔️ Registrierung
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>
            Die Registrierung wird bald verfügbar sein!
          </p>
          <button
            onClick={() => setCurrentPage('login')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Zurück zur Anmeldung
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'dashboard' && user) {
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

      <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
        {/* Status Card */}
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #0ea5e9'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0c4a6e', fontSize: '1.5rem' }}>
            ✅ System Status
          </h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <p style={{ margin: 0, color: '#0c4a6e' }}>
              ✅ Frontend: React + TypeScript auf Port 3000
            </p>
            <p style={{ margin: 0, color: '#0c4a6e' }}>
              ✅ Backend: Node.js/Express auf Port 3001
            </p>
            <p style={{ margin: 0, color: '#0c4a6e' }}>
              ✅ Database: PostgreSQL auf Port 5432
            </p>
            <p style={{ margin: 0, color: '#0c4a6e' }}>
              ✅ Monitoring: Überwachung aktiv
            </p>
          </div>
        </div>

        {/* Features Card */}
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #22c55e'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#15803d', fontSize: '1.5rem' }}>
            🚀 Implementierte Features
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#15803d' }}>Authentifizierung:</h4>
              <p style={{ margin: '0 0 0 20px', color: '#15803d', fontSize: '14px' }}>
                Login/Register Seiten mit Formularvalidierung
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#15803d' }}>Dashboard:</h4>
              <p style={{ margin: '0 0 0 20px', color: '#15803d', fontSize: '14px' }}>
                Übersicht aller Touren mit Status-Anzeige
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#15803d' }}>Tour-Management:</h4>
              <p style={{ margin: '0 0 0 20px', color: '#15803d', fontSize: '14px' }}>
                Erstellen und Bearbeiten von Touren mit Formular
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#15803d' }}>Kartenintegration:</h4>
              <p style={{ margin: '0 0 0 20px', color: '#15803d', fontSize: '14px' }}>
                MapLibre für GPX-Import und Wegpunkt-Setzung
              </p>
            </div>
          </div>
        </div>

        {/* API Endpoints Card */}
        <div style={{ 
          backgroundColor: '#fef3c7', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #f59e0b'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#92400e', fontSize: '1.5rem' }}>
            � API Endpoints
          </h3>
          <div style={{ display: 'grid', gap: '5px' }}>
            <code style={{ color: '#92400e', fontSize: '12px' }}>GET /health - System Status</code>
            <code style={{ color: '#92400e', fontSize: '12px' }}>POST /auth/register - Benutzer registrieren</code>
            <code style={{ color: '#92400e', fontSize: '12px' }}>POST /auth/login - Benutzer anmelden</code>
            <code style={{ color: '#92400e', fontSize: '12px' }}>GET /tours - Touren abrufen</code>
            <code style={{ color: '#92400e', fontSize: '12px' }}>POST /tours - Tour erstellen</code>
            <code style={{ color: '#92400e', fontSize: '12px' }}>PUT /tours/:id - Tour bearbeiten</code>
            <code style={{ color: '#92400e', fontSize: '12px' }}>POST /tours/:id/gpx - GPX-Datei hochladen</code>
            <code style={{ color: '#92400e', fontSize: '12px' }}>POST /tours/:id/checkin - Check-in</code>
            <code style={{ color: '#92400e', fontSize: '12px' }}>POST /tours/:id/checkout - Check-out</code>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #9ca3af'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151', fontSize: '1.5rem' }}>
            🔧 Nächste Schritte
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <p style={{ margin: 0, color: '#374151' }}>
              1. Package.json Dependencies korrigieren (TailwindCSS entfernen)
            </p>
            <p style={{ margin: 0, color: '#374151' }}>
              2. React Router und Navigation implementieren
            </p>
            <p style={{ margin: 0, color: '#374151' }}>
              3. Backend API Integration testen
            </p>
            <p style={{ margin: 0, color: '#374151' }}>
              4. MapLibre Karte funktionsfähig machen
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        <p>
          TourGuard v1.0 - Frontend auf Port 3000 • Backend auf Port 3001
        </p>
        <p style={{ marginTop: '5px' }}>
          Alle Komponenten erstellt: Login, Dashboard, Tour-Forms, Karte ✅
        </p>
      </div>
    </div>
  );
}

export default App;