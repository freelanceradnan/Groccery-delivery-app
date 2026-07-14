import React from 'react';
import { Outlet } from 'react-router-dom';
import Banner from '../components/Banner';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Home from './Home';

const AppLayout = () => {
    return (
        
        <div>
        <Banner/>
        <Navbar/>
        <Home/>
        <Outlet/>
        <h2>Footer</h2>
        </div>
        
    );
};

export default AppLayout;