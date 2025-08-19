import { createSlice } from "@reduxjs/toolkit";

export const BoardSlice = createSlice({
    name: "board",
    initialState: {
        board: {user:[]},
        boardList: [],
        activeBoardList: [],
        archivedBoardList:[],
        selectedUser:[],
        selectedBoard :{}
    },
    reducers: {
        setBoardList: (state,action) => {
            state.boardList = action.payload;
        },
        setActiveBoardList: (state, action) => {            
            state.activeBoardList = action.payload;
        },
        setArchivedBoardList: (state, action) => {            
            state.archivedBoardList = action.payload;
        },
        setBoard: (state, action) => {            
            state.board = action.payload;
        },
        setSelectedBoard: (state, action) => {
            state.selectedBoard[action.payload.id] = action.payload
        },
        removeSelectedBoard: (state, action) => {            
            delete state.selectedBoard[action.payload];
        },
        resetSelectedBoard: (state, action) => {
            state.selectedBoard = action.payload;
        },
        selectAllBoard: (state, action) => {
            for (var x in state.boardList)
            {
                state.selectedBoard[state.boardList[x].id] = state.boardList[x];
            }
        }
    }
})
export const { setBoard,setBoardList,setSelectedBoard,removeSelectedBoard,resetSelectedBoard,selectAllBoard,setActiveBoardList,setArchivedBoardList } = BoardSlice.actions;
export default BoardSlice.reducer;