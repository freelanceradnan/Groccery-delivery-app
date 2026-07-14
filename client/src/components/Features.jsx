import React from 'react';
import { heroSectionData } from '../assets/assets';

const Features = () => {
    return (
        <section className='bg-[#FFFFFF] py-3 border-black/40 rounded-xl'>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {heroSectionData.hero_features.map((feature,i)=>(
                <div key={i} className='flex items-center gap-3 py-3 justify-center'>
                <div className='size-10 rounded-lg bg-[#f8efdf] flex-center shrink-0 flex items-center justify-center'>
                <feature.icon className='size-5'/>
                </div>
                <div>
                    <p className='text-sm font-semibold text-[#101d14]'>{feature.title}</p>
                    <p className='text-xs text-[#6b86b5]'>{feature.desc}</p>
                   
                </div>
                </div>
                ))}
            </div>
        </div>
        </section>
    );
};

export default Features;