import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useGlobal } from '@context/GlobalContext';

interface ProtectedRouteProps {
    children: ReactNode;
}


function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { activeUser } = useGlobal();

    if (!activeUser) {
        return <Navigate to="/login" />;
    }

    return children;
}

export { ProtectedRoute };

