import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, isLoadingAuth } = useGlobal();
  const location = useLocation();

  // Mientras verificamos si hay sesión, mostramos un placeholder
  // (evita redirigir a /login en un F5 antes de tiempo)
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate">Cargando...</p>
      </div>
    );
  }

  if (!session) {
    // `replace` evita llenar el historial con la página protegida
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export { ProtectedRoute };
