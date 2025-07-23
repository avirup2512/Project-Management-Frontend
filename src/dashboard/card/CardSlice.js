import { createSlice } from "@reduxjs/toolkit";

export const CardSlice = createSlice({
    name: "card",
    initialState: {
        card: {},
        allTag: [],
    },
    reducers: {
        setAllTag: (state,action) => {
            state.allTag = action.payload;
        },
        setCurrentCard: (state, action) =>
        {
            state.card = action.payload
        }
    }
})
export const { setAllTag,setCurrentCard } = CardSlice.actions;
export default CardSlice.reducer;