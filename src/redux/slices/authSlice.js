import { createSlice } from "@reduxjs/toolkit";

// Load user session if available
const userSession = sessionStorage.getItem("user")
    ? sessionStorage.getItem("user")
    : null;

const tokenSession = sessionStorage.getItem("token") || null;

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: userSession,
        token: tokenSession,
    },
    reducers: {
        login: (state, action) => {     
            state.user = action.payload.user;
            state.token = action.payload.token;
            sessionStorage.setItem("user", action.payload.user);
            sessionStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
