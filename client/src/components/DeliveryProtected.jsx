import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const DeliveryProtected = () => {
    const deliveryToken = localStorage.getItem('delivery_token');

   
    if (!deliveryToken) {
        return <Navigate to="/delivery/login" replace />;
    }

   
    return <Outlet />;
};

export default DeliveryProtected;