import { createSlice } from "@reduxjs/toolkit";

export const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    page: "",
    allRoles: [],
    defaultPaginationObject: {
      items: 1,
      itemPerPage: 5,
      totalCount: 0,
      currentOffset: 0,
    },
    projectPaginationObject: {
      items: 1,
      itemPerPage: 5,
      totalCount: 0,
      currentOffset: 0,
    },
    boardPaginationObject: {
      items: 1,
      itemPerPage: 5,
      totalCount: 0,
      currentOffset: 0,
    },
    paginateHappen: false,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setAllRoles: (state, action) => {
      state.allRoles = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setProjectPaginationObject: (state, action) => {
      state.projectPaginationObject = action.payload;
    },
    setProjectPaginationDefault: (state, action) => {
      state.projectPaginationObject = action.payload;
    },
    setBoardPaginationObject: (state, action) => {
      state.boardPaginationObject = action.payload;
    },
    setBoardPaginationDefault: (state, action) => {
      state.boardPaginationObject = action.payload;
    },
    setPaginateHappen: (state, action) => {
      state.paginateHappen = !state.paginateHappen;
    },
  },
});
export const {
  setPage,
  setAllRoles,
  setProjectPaginationObject,
  setBoardPaginationObject,
  setProjectPaginationDefault,
  setBoardPaginationDefault,
  setPaginateHappen,
} = DashboardSlice.actions;
export default DashboardSlice.reducer;
