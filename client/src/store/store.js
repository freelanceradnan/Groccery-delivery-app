import { configureStore } from "@reduxjs/toolkit";
import { ApiSlice } from "../Feature/ApiSlice";
import { CartSlice } from "../Feature/CartSlice";
const store=configureStore({
    reducer:{
     [ApiSlice.reducerPath]:ApiSlice.reducer,
     cart:CartSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ApiSlice.middleware),
})
export default store