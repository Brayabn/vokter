import { Link } from 'react-router-dom';

// Estados reutilizables: carga, error (con reintento) y vacío.
// Evitan pantallas en blanco y distinguen "no hay datos" de "falló la conexión".

export function LoadingState({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-lavender" role="status">
      <span className="h-6 w-6 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
      <p className="text-3xl">⚠️</p>
      <p className="text-lavender max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-full border border-gold text-gold px-6 py-2.5 hover:bg-gold/10 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-lavender">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="text-gold hover:text-goldSoft">{actionLabel}</Link>
      )}
    </div>
  );
}
