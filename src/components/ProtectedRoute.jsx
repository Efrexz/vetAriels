import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { GlobalContext } from "../context/GlobalContext";

function ProtectedRoute({ children }) {
    const { activeUser } = useContext(GlobalContext);

    if (!activeUser) {
        return <Navigate to="/login" />;
    }

    return children;
}

export { ProtectedRoute };

ProtectedRoute.propTypes = {
    children: PropTypes.node
}