import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from "../auth/AuthSlice";
import BoardReducer from "../dashboard/board/BoardSlice";
import UserSlice from "../dashboard/userProfile/UserSlice";
export default configureStore({
    reducer: {
        auth: AuthReducer,
        board: BoardReducer,
        user:UserSlice
    }
})