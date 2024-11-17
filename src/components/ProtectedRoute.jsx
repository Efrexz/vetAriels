import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const { activeUser } = useContext(GlobalContext);

    if (!activeUser) {
        return <Navigate to="/login" />;
    }

    return children;
}

export { ProtectedRoute };