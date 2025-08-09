import { createSlice } from "@reduxjs/toolkit";

export const BoardSlice = createSlice({
    name: "board",
    initialState: {
        board: {user:[]},
        boardList: [],
        selectedUser:[]
    },
    reducers: {
        setBoardList: (state,action) => {
            state.boardList = action.payload;
        },
        setBoard: (state, action) => {            
            state.board = action.payload;
        }
    }
})
export const { setBoard,setBoardList } = BoardSlice.actions;
export default BoardSlice.reducer;