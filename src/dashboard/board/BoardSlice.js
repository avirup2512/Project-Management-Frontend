import { createSlice } from "@reduxjs/toolkit";

export const BoardSlice = createSlice({
  name: "board",
  initialState: {
    board: { user: [] },
    boardList: {},
    activeBoardList: [],
    archivedBoardList: [],
    selectedUser: [],
    selectedBoard: {},
  },
  reducers: {
    setBoardList: (state, action) => {
      state.boardList = action.payload;
    },
    setArchiveBoard: (state, action) => {
      for (let x in state.boardList) {
        if (action.payload.indexOf(x) !== -1) {
          delete state.boardList[x];
        }
      }
    },
    deleteBoardRedux: (state, action) => {
      for (let x in state.boardList) {
        if (action.payload.indexOf(x) !== -1) {
          delete state.boardList[x];
        }
      }
    },
    setBoard: (state, action) => {
      console.log(action.payload);

      state.board = action.payload;
    },
    setSelectedBoard: (state, action) => {
      state.selectedBoard[action.payload.id] = action.payload;
    },
    removeSelectedBoard: (state, action) => {
      delete state.selectedBoard[action.payload];
    },
    resetSelectedBoard: (state, action) => {
      state.selectedBoard = action.payload;
    },
    selectAllBoard: (state, action) => {
      for (var x in state.boardList) {
        state.selectedBoard[state.boardList[x].id] = state.boardList[x];
      }
    },
  },
});
export const {
  setBoard,
  setBoardList,
  setSelectedBoard,
  removeSelectedBoard,
  resetSelectedBoard,
  selectAllBoard,
  setArchiveBoard,
  deleteBoardRedux,
} = BoardSlice.actions;
export default BoardSlice.reducer;
