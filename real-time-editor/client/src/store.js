import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./reduxStore/userSlice"

export const store = configureStore({
    reducer:{
        user:userSlice
    }
})