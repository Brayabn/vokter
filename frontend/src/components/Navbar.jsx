import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-white/5 bg-ink/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-xl tracking-tight text-mist">
          VØKTER
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-lavender">
          <Link to="/explorar" className="hover:text-mist transition-colors">Explorar</Link>
          {user && <Link to="/dashboard" className="hover:text-mist transition-colors">Panel</Link>}
          {user && <Link to="/favoritos" className="hover:text-mist transition-colors">Favoritos</Link>}
          <Link to="/descarga" className="hover:text-mist transition-colors">Descarga la app</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-lavender">Hola, {user.name.split(' ')[0]}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-sm px-4 py-2 rounded-full border border-white/10 text-mist hover:bg-surface transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-4 py-2 rounded-full text-mist hover:bg-surface transition-colors">
                Ingresar
              </Link>
              <Link to="/registro" className="text-sm px-4 py-2 rounded-full bg-gold text-ink font-semibold hover:bg-goldSoft transition-colors">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
