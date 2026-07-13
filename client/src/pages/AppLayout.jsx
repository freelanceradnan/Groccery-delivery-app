import React from 'react';
import { Outlet } from 'react-router-dom';
import Banner from '../components/Banner';

const AppLayout = () => {
    return (
        
        <div>
        <Banner/>
        <Outlet/>
        <h2>Footer</h2>
        </div>
        
    );
};

export default AppLayout;