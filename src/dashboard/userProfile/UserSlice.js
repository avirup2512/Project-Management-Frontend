import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
    name: "user",
    initialState: {
        allUserList: [],
        loggedInUser:{}
    },
    reducers: {
        setUserList: (state,action) => {
            state.allUserList = action.payload;
        },
        setUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        setSelectedUser: (state, action) => {
            
        }
    }
})
export const { setUser,setUserList } = UserSlice.actions;
export default UserSlice.reducer;