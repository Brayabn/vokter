import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from './StateViews';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24">
        <LoadingState message="Cargando..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
