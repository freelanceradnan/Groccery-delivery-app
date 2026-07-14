import { MailIcon } from 'lucide-react';
import React from 'react';

const Newsletter = () => {
    return (
        <section className='bg-white py-16 px-4 sm:px-6 rounded-3xl mx-auto shadow-xs mt-32 mb-20'>
        <div className='max-w-2xl mx-auto text-center'>
         <div className="size-16 bg-white rounded-xl flex-center mx-auto mb-6 shadow flex justify-center items-center">
            <MailIcon className='size-8 text-tight' strokeWidth={1.5}/>
         </div>
         <h2 className='text-3xl font-semibold text-tight mb-4'>Subscribe to our Newsletter</h2>
         <p className='text-light mb-8 text-base'>Get weekly updates on fresh produce, seasonal offers, and exclusive discounts right to your inbox.</p>
         <form action="" className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
            <input type="email" placeholder='Enter your email address' required className='flex-1 px-5 py-3.5 rounded-xl border border-slate-400 focus:outline-none focus:border-green-300 focus:ring bg-white text-sm transition-all'/>
            <button type='submit' className='px-8 py-3.5 bg-[#1B3022] text-white font-semibold rounded-xl hover:bg-[#1B3022]/80 transition-colors shadow-sm whitespace-nowrap active:scale-[0.98]'>Subscribe</button>
         </form>
        </div>

        </section>
    );
};

export default Newsletter;