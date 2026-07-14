import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HomeCategories from '../components/HomeCategories';
import PopularProduct from '../components/PopularProduct';
import AppPromoBanner from '../components/AppPromoBanner';
import Newsletter from '../components/Newsletter';


const Home = () => {
    return (
        <div className='min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8 bg-[#FAF7F2]'>
          <Hero/>
          <Features/>
          <HomeCategories/>
          <PopularProduct/>
          <AppPromoBanner/>
          <Newsletter/>
        
        </div>
    );
};

export default Home;