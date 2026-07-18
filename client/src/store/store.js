import { configureStore } from "@reduxjs/toolkit";
import { ApiSlice } from "../Feature/ApiSlice";
const store=configureStore({
    reducer:{
     [ApiSlice.reducerPath]:ApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ApiSlice.middleware),
})
export default store