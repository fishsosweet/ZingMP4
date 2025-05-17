import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: React.ReactNode;
}
const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const isTokenExpired = () => {
        const expirationTime = localStorage.getItem("token_expiry");
        if (expirationTime) {
            return new Date().getTime() > parseInt(expirationTime);
        }
        return true; // Nếu không có token, coi như hết hạn
    };

    const token = localStorage.getItem("token");
    if (token && !isTokenExpired()) {
        return <>{children}</>;
    }
    return <Navigate to="/login-admin" replace />;
};

export default PrivateRoute;
