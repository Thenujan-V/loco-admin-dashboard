import { configureStore, createSlice } from "@reduxjs/toolkit";
import { authApi } from "./auth/auth-api";
import { forgotApi } from "./auth/forgot-password";

const homeSlice = createSlice({
    name: "home",
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state) => {
            state.value += 1
        },
    },
});

const store = configureStore({
    reducer: {
        home: homeSlice.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [forgotApi.reducerPath]: forgotApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(forgotApi.middleware)
});

export const homeActions = homeSlice.actions;

export default store;
