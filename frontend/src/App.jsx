import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AmbientBackground from './components/AmbientBackground';
import PageTransition from './components/PageTransition';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import ContentDetail from './pages/ContentDetail';
import Favorites from './pages/Favorites';
import DownloadApp from './pages/DownloadApp';
import ExpertProfile from './pages/ExpertProfile';

export default function App() {
  // El landing cierra con su propio footer cinemático (components/ui/motion-footer).
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <AuthProvider>
      <AmbientBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/explorar" element={<Explore />} />
              <Route path="/contenido/:id" element={<ContentDetail />} />
              <Route path="/experto/:id" element={<ExpertProfile />} />
              <Route path="/descarga" element={<DownloadApp />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/favoritos" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route
                path="*"
                element={
                  <div className="max-w-3xl mx-auto px-6 py-24 text-center">
                    <h1 className="font-display font-bold text-3xl text-mist mb-3">Página no encontrada</h1>
                    <p className="text-steel mb-6">Esa dirección no existe en la tienda.</p>
                    <Link to="/" className="text-sky hover:text-skySoft">Volver al inicio</Link>
                  </div>
                }
              />
            </Routes>
          </PageTransition>
        </main>
        {!isLanding && <Footer />}
      </div>
    </AuthProvider>
  );
}
