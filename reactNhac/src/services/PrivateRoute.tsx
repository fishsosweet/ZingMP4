import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const isTokenExpired = () => {
        const expirationTime = localStorage.getItem("admin_token_expiry");
        if (expirationTime) {
            return new Date().getTime() > parseInt(expirationTime);
        }
        return true;
    };

    const token = localStorage.getItem("admin_token");
    if (token && !isTokenExpired()) {
        return <>{children}</>;
    }
    return <Navigate to="/login-admin" replace />;
};

const PrivateRouteUser = ({ children }: PrivateRouteProps) => {
    const token = localStorage.getItem("user_token");
    const userInfo = localStorage.getItem("user_info");

    if (token && userInfo) {
        try {
            const user = JSON.parse(userInfo);
            if (user && user.id && user.level === 1) {
                return <>{children}</>;
            }
        } catch (error) {
            console.error('Lỗi khi parse user info:', error);
            localStorage.removeItem('user_info');
        }
    }
    return <Navigate to="/login-user" replace />;
};

export { PrivateRoute, PrivateRouteUser };
