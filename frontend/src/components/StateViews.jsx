import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Inbox, Loader2, RotateCw } from 'lucide-react';

// Estados reutilizables: carga, error (con reintento) y vacío.
// Evitan pantallas en blanco y distinguen "no hay datos" de "falló la conexión".

export function LoadingState({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-steel" role="status">
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-azure/25 bg-azure/10 shadow-[0_0_30px_-10px_rgba(30,107,255,0.8)]">
        <Loader2 className="h-6 w-6 text-sky animate-spin" aria-hidden="true" />
      </span>
      <p className="font-mono text-xs uppercase tracking-[0.3em]">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center" role="alert">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-danger/30 bg-danger/10">
        <AlertTriangle className="h-7 w-7 text-danger" aria-hidden="true" />
      </span>
      <p className="text-mist max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full border border-azure/60 text-sky font-semibold px-6 py-2.5 hover:bg-azure/10 hover:border-azure transition-colors"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-surface2/60">
        <Inbox className="h-7 w-7 text-steel" aria-hidden="true" />
      </span>
      <p className="text-steel max-w-md">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="group inline-flex items-center gap-1.5 font-semibold text-sky hover:text-skySoft transition-colors">
          {actionLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
