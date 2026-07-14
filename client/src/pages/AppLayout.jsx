import React from 'react';
import { Outlet } from 'react-router-dom';
import Banner from '../components/Banner';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Home from './Home';
import Footer from '../components/Footer';
import CartSideBar from '../components/CartSideBar';

const AppLayout = () => {
    return (
        
        <div>
        <Banner/>
        <Navbar/>
        <Home/>
        <Outlet/>
        <Footer/>
        <CartSideBar/>
        </div>
        
    );
};

export default AppLayout;