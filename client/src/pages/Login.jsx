import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react'; 
import toast from 'react-hot-toast';
import { useRegisterUserMutation } from '../Feature/ApiSlice';

const Login = () => {
    const navigate=useNavigate()
    const [loginstate, setLoginState] = useState(true);
    const [registeruser,{isError,isLoading:registerLoading}]=useRegisterUserMutation()
    //register users data
    const [registerData,setRegisterData]=useState({
        name:"",
        email:"",
        password:""
    })
    //register user handler change
    const changeRegisterHandler=(e)=>{
    const {name,value}=e.target
    setRegisterData((prev)=>({
        ...prev,
        [name]:value
    }))
    }
    //submit register users
   const submitRegisterHandler=async(e)=>{
   e.preventDefault()
   try {
    const response=await registeruser(registerData).unwrap()
    localStorage.setItem('token',response.token)
    localStorage.setItem('auth_user',JSON.stringify(response.user))
    setTimeout(() => {
     navigate('/')   
    }, 1000);
    toast.success('Registration Success!')
  
   } catch (error) {
    toast.error('Registration Failed!',error)
   }
   }
   //login user data
   const [loginData,setLoginData]=useState({
   email:"",
   password:""
   })
   //login change Handler
   const changeLoginHandler=(e)=>{
    const {name,value}=e.target
    setLoginData((prev)=>({
        ...prev,
        [name]:value
    }))
   }
   console.log(loginData)
   const submitLoginHandler=()=>{

   }
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
                    <Link to="/" className='flex gap-2 items-center justify-center'>
                        <img src={assets.favicon} className='h-8 w-8 object-contain' alt="logo" />
                        <div className='text-2xl font-bold text-emerald-950 tracking-tight'>Supacart</div>
                    </Link>

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
                    <form className='w-full flex flex-col gap-4' onSubmit={loginstate===true?submitLoginHandler:submitRegisterHandler}>
                        {!loginstate ? (
                            <>
                                {/* Name Input */}
                                <div className='w-full flex flex-col gap-1.5'>
                                    <label className='text-sm font-medium text-gray-700'>Full Name</label>
                                    <div className='relative flex items-center'>
                                        <User className='absolute left-3 text-gray-400 h-5 w-5' />
                                        <input 
                                            type="text"
                                            name='name'
                                            value={registerData.name}
                                            onChange={changeRegisterHandler}
                                            placeholder="Enter your name"
                                            className='w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800'
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className='w-full flex flex-col gap-1.5'>
                                    <label className='text-sm font-medium text-gray-700'>Email Address</label>
                                    <div className='relative flex items-center'>
                                        <Mail className='absolute left-3 text-gray-400 h-5 w-5' />
                                        <input 
                                        name='email'
                                            type="email"
                                            value={registerData.email}
                                            onChange={changeRegisterHandler}
                                            placeholder="ad@gmail.com"
                                            className='w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800'
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className='w-full flex flex-col gap-1.5'>
                                    <label className='text-sm font-medium text-gray-700'>Password</label>
                                    <div className='relative flex items-center'>
                                        <Lock className='absolute left-3 text-gray-400 h-5 w-5' />
                                        <input 
                                        name='password'
                                            type="password" 
                                            value={registerData.password}
                                            onChange={changeRegisterHandler}
                                            placeholder="••••••••"
                                            className='w-full pl-10 pr-4 py-2.5 bg-[#EEF2F6] rounded-xl outline-none border border-transparent focus:border-emerald-600 transition text-sm text-gray-800'
                                            required
                                        />
                                    </div>
                                </div>

                                {registerLoading ?
                            <button className='w-full bg-[#043A23] hover:bg-[#032d1b] text-white font-semibold py-3 px-4 rounded-xl mt-2 transition shadow-sm'>
                                    Registering user
                                </button> :
                                <button className='w-full bg-[#043A23] hover:bg-[#032d1b] text-white font-semibold py-3 px-4 rounded-xl mt-2 transition shadow-sm'>
                                    Register user
                                </button>     
                            }
                            </>
                        ) : (
                            <>
                                {/* Email Input */}
                                <div className='w-full flex flex-col gap-1.5'>
                                    <label className='text-sm font-medium text-gray-700'>Email Address</label>
                                    <div className='relative flex items-center'>
                                        <Mail className='absolute left-3 text-gray-400 h-5 w-5' />
                                        <input 
                                           name='email'
                                           value={setLoginData.email}
                                            type="email"
                                            onChange={changeLoginHandler}
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
                                        value={setLoginData.password}
                                        onChange={changeLoginHandler}
                                           name='password'
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