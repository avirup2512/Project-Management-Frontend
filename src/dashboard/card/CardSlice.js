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
        },
        setCheckList: (state, action) => {
            state.card.checkList.forEach((e,i) => {
                if (e.cliId == action.payload.cliId)
                {
                    state.card.checkList[i] = action.payload
                }
            })
            
        }
    }
})
export const { setAllTag,setCurrentCard,setCheckList } = CardSlice.actions;
export default CardSlice.reducer;