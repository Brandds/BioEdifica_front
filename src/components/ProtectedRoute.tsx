import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * Componente para proteger rotas que exigem autenticação.
 * Redireciona para /login se o usuário não estiver autenticado.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    // Redireciona para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  // Renderiza o componente filho se estiver autenticado
  return children;
}
