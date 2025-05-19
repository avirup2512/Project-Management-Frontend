import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        user:{}
    },
    reducers: {
        setUser: (state,action) => {
            state.user = action.payload;
        }
    }
})
export const { setUser } = AuthSlice.actions;
export default AuthSlice.reducer;