
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BaseQuery=fetchBaseQuery({
    baseUrl:import.meta.env.VITE_BASE_SERVER,
    prepareHeaders:(headers)=>{
        const token=localStorage.getItem('token')
        if(token){
            headers.set('authorization',`Bearer ${token}`)
        }
        return headers
    }
})
const baseQueryWithReauth=async(args,api,extraOptions)=>{
    let result=await BaseQuery(args,api,extraOptions)
    if(result.error && result.error.status ===401){
        localStorage.removeItem('token')
        localStorage.removeItem('auth_user')
        if(!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')){
        window.location.href='/login'
    }
    }
    return result
    
}
export const ApiSlice=createApi({
   reducerPath:'api',
   baseQuery:baseQueryWithReauth,
   tagTypes:['users'],
   endpoints:(builder)=>({
    registerUser:builder.mutation({
        query:(userData)=>({
        url:'/register',
        method:'POST',
        body:userData
        })
    }),
    loginUser:builder.mutation({
     query:(userData)=>({
     url:'/login',
     method:'POST',
     body:userData
     })
    })
   })
})
export const { useRegisterUserMutation,useLoginUserMutation} = ApiSlice;
