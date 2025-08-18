import { createSlice } from "@reduxjs/toolkit";

export const ListSlice = createSlice({
    name: "list",
    initialState: {
        list: {},
        allList: [],
        currentCard: {},
        dragging:false
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
        },
        setDragging: (state, action) => {
            state.dragging = action.payload;
        }
    }
})
export const { setList,setAllList,setCurrentCard, setDragging } = ListSlice.actions;
export default ListSlice.reducer;