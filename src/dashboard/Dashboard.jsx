import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Board from "./board/board";
import Sidebar from "./sidebar/SideBar";
import Topmenu from "./topMenu/Topmenu";
import { useState } from "react";
import { DashboardMessageContext } from "./DashboardMessageContext";
import UserProfile from "./userProfile/UserProfile";
function Dashboard({onTriggerDashboard})
{
    const [message, setMessage] = useState("");
    return (
            <DashboardMessageContext.Provider value={{ message, setMessage}}>
                <Topmenu />
                <div className="d-flex">
                    <Sidebar/>
                    <div className="p-4 w-100">
                        <h2>Welcome to the main content area</h2>
                        <p>This is your dashboard or whatever you want here.</p>
                        <Routes>
                            <Route path="/" element={<Navigate to="board"/>}></Route>
                        <Route path="board" element={<Board />}></Route>
                        <Route path="user" element={<UserProfile></UserProfile>}></Route>
                        </Routes>
                    </div>
                </div>
            </DashboardMessageContext.Provider>


    )
}

export default Dashboard;