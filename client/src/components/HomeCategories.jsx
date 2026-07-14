import React from 'react';
import { categoriesData } from '../assets/assets';
import { Link } from 'react-router-dom';

const HomeCategories = () => {
    return (
        <section className='py-16'>
        <div className="max-w-7xl mx-auto">
            <div>
                <h2 className='text-2xl text-tight font-semibold'>Browse Categories</h2>
                <p className='text-sm text-light'>Find exactly what you need using</p>
            </div>
          <div className="flex items-center mt-8 overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2 sm:gap-4">
    {categoriesData.map((cat) => (
        <Link 
            key={cat.slug} 
            to={`/products?category=${cat.slug}`} 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="group flex flex-col items-center gap-2 p-2 shrink-0 snap-start min-w-[80px] sm:min-w-[100px]"
        >
            {/* Image Container */}
            <div className="size-16 sm:size-20 p-2 rounded-2xl overflow-hidden bg-orange-300/75 group-hover:scale-105 transition-all flex items-center justify-center">
                <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-all"
                />
            </div>
            
            {/* Text Container */}
            <div className="text-center">
                <h2 className="text-[11px] sm:text-[13px] text-gray-700 font-semibold group-hover:text-orange-500 transition-colors line-clamp-1">
                    {cat.name}
                </h2>
            </div>
        </Link>
    ))}
</div>
        </div>
        </section>
    );
};

export default HomeCategories;