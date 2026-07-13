import { TruckIcon, XIcon, ZapIcon } from 'lucide-react';
import React, { useState } from 'react';

const Banner = () => {
    const [bannerVisible, setBannerVisible] = useState(() => {
        return sessionStorage.getItem('banner_dismissed') !== 'true';
    });

    const dismissBanner = () => {
        setBannerVisible(false);
        sessionStorage.setItem('banner_dismissed', 'true');
    };

    return (
        <div>
            {bannerVisible && (
             
                <div className='bg-gradient-to-r from-green-900 via-emerald-800 to-green-600 text-white text-xs sm:text-sm relative overflow-hidden'>
                    <div className='mx-auto px-4 sm:px-6 lg:px-8 py-1 flex justify-center items-center gap-6'>
                        <div className='flex justify-center items-center gap-4 sm:gap-6 '>
                            
                          
                            <div className='flex gap-2 justify-center items-center'>
                                <TruckIcon className='size-4 shrink-0' />
                                <p className='text-[10px] font-medium'>Free delivery on orders above $20</p>
                            </div> |
                            <div className='flex gap-2 justify-center items-center pl-4 sm:pl-6'>
                                <ZapIcon className='size-4 shrink-0' />
                                <p className='text-[10px] font-medium'>Lightning fast service 24/7</p>
                            </div>
                            
                        </div>
                    </div>
                    
                   
                    <button onClick={dismissBanner} className='absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors' aria-label="Dismiss banner">
                        <XIcon className='size-4' />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Banner;