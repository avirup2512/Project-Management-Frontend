import { createSlice } from "@reduxjs/toolkit";

export const DashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        allRoles: []
    },
    reducers: {
        setAllRoles: (state,action) => {
            state.allRoles = action.payload;
        }
    }
})
export const { setAllRoles } = DashboardSlice.actions;
export default DashboardSlice.reducer;