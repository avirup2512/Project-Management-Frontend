import { createSlice } from "@reduxjs/toolkit";

export const ListSlice = createSlice({
    name: "list",
    initialState: {
        list: {},
        allList: [],
        currentCard:{}
    },
    reducers: {
        setAllList: (state,action) => {
            state.allList = action.payload;
        },
        setList: (state, action) => {
            state.list = action.payload;
        },
        setCurrentCard: (state, action) =>
        {
            state.currentCard = action.payload
        }
    }
})
export const { setList,setAllList,setCurrentCard } = ListSlice.actions;
export default ListSlice.reducer;