import { configureStore, createSlice } from "@reduxjs/toolkit";
import { authApi } from "./auth/auth-api";
import { forgotApi } from "./auth/forgot-password";
import { userApi } from "./users/user-api";
import { pickupPersonApi } from "./pickup-person/pickup-person-api";
import { deliveryPersonApi } from "./delivery-person/delivery-person-api";
import { restaurantApi } from "./restaurants/restaurant-api";

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
        [userApi.reducerPath]: userApi.reducer,
        [pickupPersonApi.reducerPath]: pickupPersonApi.reducer,
        [deliveryPersonApi.reducerPath]: deliveryPersonApi.reducer,
        [restaurantApi.reducerPath]: restaurantApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(forgotApi.middleware)
        .concat(userApi.middleware)
        .concat(pickupPersonApi.middleware)
        .concat(deliveryPersonApi.middleware)
        .concat(restaurantApi.middleware)
});

export const homeActions = homeSlice.actions;

export default store;
