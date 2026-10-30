import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24 bg-ink/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link to="/" className="font-display font-extrabold text-mist">
          V<span className="text-sky">Ø</span>KTER
        </Link>
        <p className="text-sm text-steel">Todo lo que buscas, en una sola frase.</p>
        <Link to="/descarga" className="text-sm text-sky hover:text-skySoft transition-colors">
          Descargar la app móvil
        </Link>
      </div>
    </footer>
  );
}
