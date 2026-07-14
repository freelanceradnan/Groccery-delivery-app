import React from 'react';
import { assets, heroSectionData } from '../assets/assets';
import { ArrowRightIcon, LeafIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className='relative overflow-hidden min-h-[500px] mb-10 rounded-3xl flex items-center'>
        <img src={assets.hero_bg} alt="" className='absolute inset-0 h-full w-full object-cover'/>
        <div className='absolute inset-0 bg-linear-to-r from-green-800 via-green-900/65 to-transparent'>
        <div className="relative max-w-7xl max-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className='max-w-xl xl:pl-10'>
             <span className='inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-orange-300 bg-orange-300/10 rounded-full mb-5'>
                <LeafIcon className='size-3'/>Farm-Fresh & Organic
             </span>
            <h1 className='font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5'>
                Nourish your home With<span className='text-orange-300'> Earth's finest</span>
            </h1>
            <p className='text-base text-white/70 leading-relaxed mb-8 max-w-md'>
                {heroSectionData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
    {/* Button 1: Shop Now */}
    <Link 
        to="/products" 
        className="h-12 px-7 bg-orange-400 text-white font-semibold rounded-full hover:bg-orange-500 transition-all active:scale-[0.98] flex justify-center items-center gap-2 w-full sm:w-auto"
    >
        Shop Now 
        <ArrowRightIcon className="size-4"/>
    </Link>

    {/* Button 2: Browse Categories */}
    <Link 
        to="/products" 
        className="h-12 px-7 bg-white/20 text-white font-semibold rounded-full hover:bg-white/50 transition-all active:scale-[0.98] flex justify-center items-center gap-2 w-full sm:w-auto"
    >
        Browse Categories 
        <ArrowRightIcon className="size-4"/>
    </Link>
</div>
            </div>
        </div>
        </div>
        </div>
    );
};

export default Hero;