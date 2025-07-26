import { createSlice } from "@reduxjs/toolkit";

export const ProjectSlice = createSlice({
    name: "board",
    initialState: {
        project: {user:[]},
        projectList: [],
        selectedUser:[]
    },
    reducers: {
        setProjectList: (state,action) => {
            state.projectList = action.payload;
        },
        setProject: (state, action) => {
            state.project = action.payload;
        }
    }
})
export const { setProject,setProjectList } = ProjectSlice.actions;
export default ProjectSlice.reducer;