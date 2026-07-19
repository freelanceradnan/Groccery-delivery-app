import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedUser = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');

  
    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />;
    }


    return children ? children : <Outlet />;
};

export default ProtectedUser;