import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react'; 

const Login = () => {
    const [loginstate, setLoginState] = useState(true);

    return (
        <div className='min-h-screen flex'>
            {/* left-side */}
            <div className='hidden lg:flex lg:w-1/2 relative items-center justify-center bg-emerald-950'>
                <img src={assets.loginpng} alt="" className='absolute inset-0 object-cover w-full h-full bg-center opacity-40' />
                <div className='relative text-center px-12 z-10'>
                    <h2 className='text-4xl font-semibold text-white mb-4'>Welcome back to Supacart</h2>
                    <p className='text-white/80 font-serif text-xl max-w-sm mx-auto'>Fresh groceries and organic produce, delivered to your doorstep.</p>
                </div>
            </div>

            {/* right-side */}
            <div className='flex-1 flex items-center justify-center px-4 py-12 bg-[#FAF8F5]'>
                <div className='w-full max-w-md flex flex-col items-center gap-6'>

                    {/* Logo */}
                    <div className='flex gap-2 items-center justify-center'>
                        <img src={assets.favicon} className='h-8 w-8 object-contain' alt="logo" />
                        <div className='text-2xl font-bold text-emerald-950 tracking-tight'>Supacart</div>
                    </div>

                    {/* Header Heading Toggle */}
                    <div className='text-center'>
                        {loginstate ? (
                            <>
                                <div className='text-2xl font-bold text-gray-900 mb-1'>Sign in to your account</div>
                                <div className='flex gap-1.5 justify-center items-center'>
                                    <h2 className='text-sm text-gray-500'>Don't have an account?</h2>
                                    <button className='text-sm text-orange-600 font-semibold hover:underline' onClick={() => setLoginState(!loginstate)}>Create one</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='text-2xl font-bold text-gray-900 mb-1'>Sign up for an account</div>
                                <div className='flex gap-1.5 justify-center items-center'>
                                    <h2 className='text-sm text-gray-500'>Already have an account?</h2>
                                    <button className='text-sm text-orange-600 font-semibold hover:underline' onClick={() => setLoginState(!loginstate)}>Login Account</button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Form Layout */}
                    <form className='w-full flex flex-col gap-4' onSubmit={(e) => e.preventDefault()}>
                        {!loginstate ? (
                            <>
                                {/* Name Input */}
                                <div className='w-full flex flex-col gap-1.5'>
                                    <label className='text-sm font-medium text-gray-700'>Full Name</label>
                                    <div className='relative flex items-center'>
                                        <User className='absolute left-3 text-gray-400 h-5 w-5' />
                                        <input 
                                            type="text" 
                                            placeholder="Enter your name"
                                            className='w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800'
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className='w-full flex flex-col gap-1.5'>
                                    <label className='text-sm font-medium text-gray-700'>Email Address</label>
                                    <div className='relative flex items-center'>
                                        <Mail className='absolute left-3 text-gray-400 h-5 w-5' />
                                        <input 
                                            type="email" 
                                            placeholder="ad@gmail.com"
                                            className='w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800'
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className='w-full flex flex-col gap-1.5'>
                                    <label className='text-sm font-medium text-gray-700'>Password</label>
                                    <div className='relative flex items-center'>
                                        <Lock className='absolute left-3 text-gray-400 h-5 w-5' />
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            className='w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800'
                                        />
                                    </div>
                                </div>

                                <button className='w-full bg-[#043A23] hover:bg-[#032d1b] text-white font-semibold py-3 px-4 rounded-xl mt-2 transition shadow-sm'>
                                    Create Account
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Email Input */}
                                <div className='w-full flex flex-col gap-1.5'>
                                    <label className='text-sm font-medium text-gray-700'>Email Address</label>
                                    <div className='relative flex items-center'>
                                        <Mail className='absolute left-3 text-gray-400 h-5 w-5' />
                                        <input 
                                            type="email" 
                                            placeholder="ad@gmail.com"
                                            className='w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800'
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className='w-full flex flex-col gap-1.5'>
                                    <label className='text-sm font-medium text-gray-700'>Password</label>
                                    <div className='relative flex items-center'>
                                        <Lock className='absolute left-3 text-gray-400 h-5 w-5' />
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            className='w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800'
                                        />
                                    </div>
                                </div>

                                <button className='w-full bg-[#043A23] hover:bg-[#032d1b] text-white font-semibold py-3 px-4 rounded-xl mt-2 transition shadow-sm'>
                                    Sign In
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;