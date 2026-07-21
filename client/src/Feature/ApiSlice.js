import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_SERVER,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    const deliverytoken=localStorage.getItem('delivery_token')
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    if(deliverytoken){
       headers.set("authorization", `Bearer ${deliverytoken}`);
    }
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await BaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");
    if (
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/register")
    ) {
      window.location.href = "/login";
    }
  }
  return result;
};
export const ApiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["users", "address", "orders", "products",'partner'],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/login",
        method: "POST",
        body: userData,
      }),
    }),
    emailVerify: builder.mutation({
      query: (email) => ({
        url: "/verifyemail",
        method: "POST",
        body: email,
      }),
    }),
    otpVerify: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/veryotp",
        method: "POST",
        body: { email, otp },
      }),
    }),
    changePassword: builder.mutation({
      query: (userdata) => ({
        url: "/changepassword",
        method: "POST",
        body: userdata,
      }),
    }),
    getAllProduct: builder.query({
      query: ({ category, search, minPrice, maxPrice, sort } = {}) => ({
        url: "/products",
        method: "GET",
        params: { category, search, minPrice, maxPrice, sort },
      }),

      transformResponse: (response) =>
        response?.products || response?.message || response,

      providesTags: ["products"],
    }),
    getFlashDeals: builder.query({
      query: () => ({
        url: "products/flash-deails",
        method: "GET",
      }),
      transformResponse: (response) => response.message.message || response,
       providesTags: ["products"],
    }),
    addAddress: builder.mutation({
      query: (payload) => ({
        url: "/createaddress",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["address"],
    }),
    updateAddress: builder.mutation({
      query: ({ id, data }) => ({
        url: `/updateaddress/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["address"],
    }),
    getUsersAddress: builder.query({
      query: () => ({
        url: "/getaddresses",
        method: "GET",
      }),
      transformResponse: (response) => response.data || response,
      providesTags: ["address"],
    }),
    deleteUserAddress: builder.mutation({
      query: (id) => ({
        url: `/deleteaddress/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["address"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/createorder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["orders",'products'],
    }),
    getOrderDatailsById: builder.query({
      query: (id) => ({
        url: `/getuserorder/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response.order || response,
      providesTags: ["orders"],
    }),
    getUserAllOrders: builder.query({
      query: () => ({
        url: "/getuserorders",
        mathod: "GET",
      }),
      transformResponse: (response) => response.result.orders || response,
      providesTags: ["orders"],
    }),
    getAdminOrders: builder.query({
      query: () => ({
        url: "/getallorder",
        method: "GET",
      }),
      transformResponse: (response) => response.orders || response,
      providesTags: ["orders"],
    }),
    updateAdminOrderStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: `/updateorder/${id}`,
        method: "PUT",
        body: { status: body },
      }),
      invalidatesTags: ["orders"],
    }),
    reduceProductStock: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    getSingleProductInfo: builder.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      transformResponse:(response)=>response.message||response
    }),
    uploadImage:builder.mutation({
    query:(formData)=>({
    url:'/upload',
    method:'POST',
    body:formData
    })
    }),
    updateAdminProduct:builder.mutation({
    query:({id,data})=>({
    url:`/product/${id}`,
    method:'PUT',
    body:data
    }),
    invalidatesTags:['products']
    }),
    addAdminProduct:builder.mutation({
     query:(data)=>({
     url:'/product',
     method:'POST',
     body:data
     }),
     invalidatesTags:['products']
    }),
    getAllDeliveryPartner:builder.query({
    query:()=>({
    url:'/delivery-partners',
    method:'GET'
    }),
    transformResponse:(response)=>response.partners||response,
    providesTags:['partner']
    }),
    createDeliveryPartner:builder.mutation({
    query:(data)=>({
    url:'/delivery-partners',
    method:'POST',
    body:data
    }),
    invalidatesTags:['partner']
    }),
    updateDeliveryPartnerStatus:builder.mutation({
     query:({id,status})=>({
     url:`/delivery-partners/${id}`,
     method:'PUT',
     body:{status}
     }),
     invalidatesTags:['partner']
    }),
    assignDeliveryPartner: builder.mutation({
  query: ({ orderId, partnerId }) => ({
    url: `/orders/${orderId}/assign`,
    method: 'PUT',
    body: { partnerId } 
  }),
  invalidatesTags:['orders']
    }),
    getAdminStats:builder.query({
     query:()=>({
     url:'/stats',
     method:'GET'
     }),
     providesTags:['orders','products','partner','users'],
     transformResponse:(response)=>response.data||response
    }),
    deliveryLogin:builder.mutation({
      query:(data)=>({
      url:'/login/deliverypartner',
      method:'POST',
      body:data
      })
    }),
    deliveryPartnerOrder:builder.query({
    query:()=>({
    url:'/my-deliveries',
    method:'GET'
    }),
    transformResponse:(response)=>response.orders||response,
    providesTags:['orders']
    }),
    orderStatusDeliveryUpdate:builder.mutation({
    query:({id,status})=>({
    url:`/my-deliveries/${id}`,
    method:'PUT',
    body:{status}
    }),
    invalidatesTags:['orders']
    })
  }),
});
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useEmailVerifyMutation,
  useOtpVerifyMutation,
  useChangePasswordMutation,
  useGetAllProductQuery,
  useGetFlashDealsQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useGetUsersAddressQuery,
  useDeleteUserAddressMutation,
  useCreateOrderMutation,
  useGetOrderDatailsByIdQuery,
  useGetUserAllOrdersQuery,
  useGetAdminOrdersQuery,
  useUpdateAdminOrderStatusMutation,
  useReduceProductStockMutation,
  useGetSingleProductInfoQuery,
  useUploadImageMutation,
  useUpdateAdminProductMutation,
  useAddAdminProductMutation,
  useGetAllDeliveryPartnerQuery,
  useCreateDeliveryPartnerMutation,
  useUpdateDeliveryPartnerStatusMutation,
  useAssignDeliveryPartnerMutation,
  useGetAdminStatsQuery,
  useDeliveryLoginMutation,
  useDeliveryPartnerOrderQuery,
  useOrderStatusDeliveryUpdateMutation
} = ApiSlice;
