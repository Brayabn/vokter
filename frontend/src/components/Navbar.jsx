import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '@/lib/utils';

const linkClass = ({ isActive }) =>
  cn('transition-colors hover:text-mist', isActive ? 'text-mist' : 'text-steel');

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Sobre el hero del landing la barra es transparente; al hacer scroll pasa a vidrio.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // El menú móvil se cierra al navegar.
  useEffect(() => setOpen(false), [pathname]);

  const transparent = pathname === '/' && !scrolled && !open;

  const links = [
    { to: '/explorar', label: 'Catálogo' },
    ...(user ? [{ to: '/dashboard', label: 'Panel' }, { to: '/favoritos', label: 'Favoritos' }] : []),
    { to: '/descarga', label: 'Descarga la app' },
  ];

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b transition-[background-color,border-color,backdrop-filter] duration-500',
        transparent ? 'border-transparent bg-transparent' : 'border-white/10 bg-ink/70 backdrop-blur-xl backdrop-saturate-150'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-extrabold text-xl tracking-tight text-mist">
          V<span className="text-sky">Ø</span>KTER
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm" aria-label="Principal">
          {links.map((l) => <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>)}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-steel">Hola, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="hidden md:inline-flex text-sm px-4 py-2 rounded-full border border-white/15 text-mist hover:bg-white/10 transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-flex text-sm px-4 py-2 rounded-full text-mist hover:bg-white/10 transition-colors">
                Ingresar
              </Link>
              <Link to="/registro" className="text-sm px-4 py-2 rounded-full bg-azure text-mist font-semibold hover:bg-azureDeep transition-colors">
                Crear cuenta
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden -mr-2 p-2 rounded-full text-mist hover:bg-white/10 transition-colors"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-movil" className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-1" aria-label="Menú móvil">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={(s) => cn(linkClass(s), 'py-3 text-base')}>{l.label}</NavLink>
          ))}
          {user ? (
            <button onClick={handleLogout} className="py-3 text-left text-base text-steel hover:text-mist transition-colors">
              Salir
            </button>
          ) : (
            <NavLink to="/login" className={(s) => cn(linkClass(s), 'py-3 text-base sm:hidden')}>Ingresar</NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
