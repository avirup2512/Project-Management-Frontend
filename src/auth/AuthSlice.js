import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        user: {},
        hasDefaultProject: false,
        defaultProject:{}
    },
    reducers: {
        setUser: (state,action) => {
            state.user = action.payload;
        },
        setHasDefaultProject: (state, action) => {
            state.hasDefaultProject = action.payload;
        },
        setDefaultProject: (state, action) => {
            state.defaultProject = action.payload;
        }
    }
})
export const { setUser,setHasDefaultProject,setDefaultProject } = AuthSlice.actions;
export default AuthSlice.reducer;