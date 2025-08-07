import { createSlice } from "@reduxjs/toolkit";

export const AppSlice = createSlice({
    name: "app",
    initialState: {
        showLoader:false
    },
    reducers: {
        setShowLoader: (state,action) => {
            state.showLoader = action.payload;
        }
    }
})
export const { setShowLoader } = AppSlice.actions;
export default AppSlice.reducer;