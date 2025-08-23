import { createSlice } from "@reduxjs/toolkit";

export const ListSlice = createSlice({
  name: "list",
  initialState: {
    list: {},
    allList: [],
    currentCard: {},
    dragging: false,
    menu: [
      {
        id: 1,
        name: "Add Card",
        type: "addCard",
        show: true,
      },
      {
        id: 2,
        name: "Archive List",
        type: "archiveList",
        show: true,
      },
      {
        id: 3,
        name: "Restore List",
        type: "restoreList",
        show: true,
      },
      {
        id: 4,
        name: "Delete List",
        type: "deleteList",
        show: true,
      },
      {
        id: 5,
        name: "Copy List",
        type: "copyList",
        show: true,
      },
      {
        id: 6,
        name: "Automation",
        type: "automation",
        show: true,
      },
    ],
    activeMenuIds: [1, 2, 5, 6],
    archiveMenuIds: [3, 4],
    currentList: {},
  },
  reducers: {
    setAllList: (state, action) => {
      state.allList = action.payload;
    },
    setArchiveList: (state, action) => {
      state.allList = state.allList.filter((e) => {
        return e.id !== action.payload;
      });
      console.log(state.allList);
    },
    setList: (state, action) => {
      state.list = action.payload;
    },
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload;
    },
    setDragging: (state, action) => {
      state.dragging = action.payload;
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    setCurrentList: (state, action) => {
      console.log(action.payload);

      state.currentList = action.payload;
    },
  },
});
export const {
  setList,
  setAllList,
  setCurrentCard,
  setDragging,
  setArchiveList,
  setMenu,
  setCurrentList,
} = ListSlice.actions;
export default ListSlice.reducer;
