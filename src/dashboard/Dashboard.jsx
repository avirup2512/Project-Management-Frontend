import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Board from "./board/board";
import Sidebar from "./sidebar/SideBar";
import Topmenu from "./topMenu/Topmenu";
import { useState } from "react";
import { DashboardMessageContext } from "./DashboardMessageContext";
import UserProfile from "./userProfile/UserProfile";
import ListContainer from "./list/ListContainer";
import CardDetails from "./card/CardDetails";
function Dashboard({messageSenderDashboard})
{
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft , setScrollLeft ] = useState(0);
    const mousedown = function (e)
    {
        let target = e.target;        
        if (target.classList.contains("listContainer"))
        {
            target = e.target.parentElement.parentElement;
        }
        setIsDown(true);
        target.classList.add("active");
        
        setStartX(e.pageX - target.offsetLeft);
        setScrollLeft(target.scrollLeft);
    }
    const mousemove = function (e)
    {
        let target = e.target;        
        if (target.classList.contains("listContainer"))
        {
            target = e.target.parentElement.parentElement;
        }
        if (!isDown)
            return;
        e.preventDefault();
        const x = e.pageX - target.offsetLeft;
        const walk = (x - startX) * 1.5; // scroll speed
        target.scrollLeft = scrollLeft - walk;
    }
    const [message, setMessage] = useState("");
    return (
            <DashboardMessageContext.Provider value={{ message, setMessage}}>
                <Topmenu />
                <div className="d-flex">
                    <Sidebar/>
                <div onMouseDown={mousedown} onMouseLeave={() => { setIsDown(false) }} onMouseUp={() => { setIsDown(false) }}
                    onMouseMove={mousemove} className="p-4 w-100 overflow-auto dashboard">
                        {/* <h2>Welcome to the main content area</h2>
                        <p>This is your dashboard or whatever you want here.</p> */}
                        <Routes>
                            <Route path="/" element={<Navigate to="board"/>}></Route>
                            <Route path="board" element={<Board />}></Route>
                            <Route path="user" element={<UserProfile></UserProfile>}></Route>
                            <Route path="list/:boardId" element={<ListContainer />}></Route>
                            <Route path="list/:boardId/:listId/card/:cardId" element={<CardDetails />}></Route>
                        </Routes>
                    </div>
                </div>
            </DashboardMessageContext.Provider>


    )
}

export default Dashboard;