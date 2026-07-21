import { Navigate, Outlet } from "react-router-dom";

export const DeliveryPublic = () => {
    const deliveryToken = localStorage.getItem('delivery_token');

    if (deliveryToken) {
        return <Navigate to="/delivery" replace />;
    }

    return <Outlet />;
};