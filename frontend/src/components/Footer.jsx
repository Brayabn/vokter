import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-display font-bold text-mist">VØKTER</p>
        <p className="text-sm text-lavender">Conecta con lo que sabes. Encuentra lo que necesitas.</p>
        <Link to="/descarga" className="text-sm text-gold hover:text-goldSoft transition-colors">
          Descargar la app móvil
        </Link>
      </div>
    </footer>
  );
}
