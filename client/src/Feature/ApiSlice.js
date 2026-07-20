
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
   tagTypes:['users','address','orders'],
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
    }),
    emailVerify:builder.mutation({
    query:(email)=>({
     url:'/verifyemail',
     method:'POST',
     body:email
    })
    }),
    otpVerify:builder.mutation({
     query:({email,otp})=>({
     url:'/veryotp',
     method:'POST',
     body:{email,otp}
     })
    }),
    changePassword:builder.mutation({
     query:(userdata)=>({
     url:'/changepassword',
     method:'POST',
     body:userdata
     })
    }),
    getAllProduct: builder.query({
        query: ({ category, search, minPrice, maxPrice, sort } = {}) => ({
            url: '/products',
            method: 'GET',
            params: { category, search, minPrice, maxPrice, sort } 
        }),
    
        transformResponse: (response) => response?.products || response?.message || response,
        
        providesTags: ['products']
    }),
    getFlashDeals:builder.query({
     query:()=>({
     url:'products/flash-deails',
     method:'GET',
     }),
     transformResponse:(response)=>response.message.message||response
    }),
    addAddress:builder.mutation({
    query:(payload)=>({
    url:'/createaddress',
    method:'POST',
    body:payload
    }),
    invalidatesTags:['address']
    }),
    updateAddress:builder.mutation({
    query:({id,data})=>({
    url:`/updateaddress/${id}`,
    method:'PUT',
    body:data
    }),
    invalidatesTags:['address']
    }),
    getUsersAddress:builder.query({
        query:()=>({
        url:'/getaddresses',
        method:'GET',
        }),
        transformResponse:(response)=>response.data||response,
        providesTags:['address']
    }),
    deleteUserAddress:builder.mutation({
    query:(id)=>({
    url:`/deleteaddress/${id}`,
    method:'DELETE'
    }),
  invalidatesTags:['address']
    }),
    createOrder:builder.mutation({
    query:(data)=>({
    url:'/createorder',
    method:'POST',
    body:data
    }),
    invalidatesTags:['orders']
    })
    
   })
})
export const { useRegisterUserMutation,useLoginUserMutation,useEmailVerifyMutation,useOtpVerifyMutation,useChangePasswordMutation,useGetAllProductQuery,useGetFlashDealsQuery,
    useAddAddressMutation,useUpdateAddressMutation,useGetUsersAddressQuery,useDeleteUserAddressMutation,useCreateOrderMutation
} = ApiSlice;
