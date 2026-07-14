import React from 'react';
import { Outlet } from 'react-router-dom';
import Banner from '../components/Banner';
import Navbar from '../components/Navbar';

const AppLayout = () => {
    return (
        
        <div>
        <Banner/>
        <Navbar/>
        <Outlet/>
        <h2>Footer</h2>
        </div>
        
    );
};

export default AppLayout;