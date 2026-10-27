import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAdminSession } from "../utils/adminApi";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    const [status, setStatus] = useState("loading");

    useEffect(() => {
        let active = true;

        getAdminSession()
            .then(() => {
                if (active) setStatus("authenticated");
            })
            .catch(() => {
                if (active) setStatus("unauthenticated");
            });

        return () => {
            active = false;
        };
    }, []);

    if (status === "loading") {
        return <div>Verifying administrator session...</div>;
    }

    if (status === "unauthenticated") {
        return (
            <Navigate
                to="/admin/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;