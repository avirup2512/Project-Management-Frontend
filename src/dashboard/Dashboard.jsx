import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Board from "./board/Board";
import Sidebar from "./sidebar/Sidebar";
import Topmenu from "./topMenu/Topmenu";
import { useEffect, useRef, useState } from "react";
import { DashboardMessageContext } from "./DashboardMessageContext";
import UserProfile from "./userProfile/UserProfile";
import ListContainer from "./list/ListContainer";
import CardDetails from "./card/CardDetails";
import AuthService from "../auth/service/AuthService";
import { UserContext } from "./UserContext";
import Project from "./project/Project";
import UserDefaultProject from "./userDefaultProject/UserDefaultProject";
import ProjectService from "./service/ProjectService";
import { setProjectList } from "./project/ProjectSlice";
import { useDispatch } from "react-redux";
import Footer from "./footer/Footer";
import { useSelector } from "react-redux";
import { setProjectPaginationObject } from "./DashboardSlice";
import "../helper/httpInterceptor";
import { setGlobalDispatch,setGlobalDispatchPayload } from '../helper/httpInterceptor';
import Loader from "../shared/Loader";

function Dashboard({messageSenderDashboard})
{
    const dispatch = useDispatch();
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [message, setMessage] = useState("");
    const [loggedInUser, setLoggedInUser] = useState("");
    const [loading, setLoading] = useState(true);
    const authService = new AuthService();
    const projectService = new ProjectService();

    const paginationObject = useSelector((e) => e.dashboard.projectPaginationObject);
    // const hasMounted = useRef(false);
    
    useEffect(() => {
        // if (!hasMounted.current) {
        //     hasMounted.current = true; // ✅ skip first run
        //     return;
        // }
        setGlobalDispatch(setLoadingFn);
        getAllProject();
        const getUser = async () => {
            let token = localStorage.getItem("token");
            const u = await authService.getUserDetails({ token });
            setLoggedInUser(u);
        }
        getUser();
    }, []);
    const getAllProject = async () => {
        const project = await projectService.getAllProject(localStorage.getItem("token"),paginationObject.itemPerPage, paginationObject.currentOffset);        
        if(project.status && project.status == 200)
        {
            const { itemPerPage } = paginationObject;
            const items = { items: Math.ceil(project?.totalCount / itemPerPage), totalCount: project?.totalCount };
            dispatch(setProjectPaginationObject({...paginationObject,...items}))
            dispatch(setProjectList(project.data));
            setLoading(false)
        } 
    }
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
    const setLoadingFn = () => {
        setLoading(false)
    }

    return (
            <DashboardMessageContext.Provider value={{ message, setMessage}}>
            <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
                {
                    loading && <Loader/>
                }
                {
                    !loading && 
                    <>
                        <Topmenu />
                        <div className="d-flex">
                            <Sidebar />
                            <div onMouseDown={mousedown} onMouseLeave={() => { setIsDown(false) }} onMouseUp={() => { setIsDown(false) }}
                            onMouseMove={mousemove} className="p-4 pb-5 w-100 overflow-scroll dashboard">
                                <Routes>
                                    <Route path="/" element={<Navigate to="project" />}></Route>
                                    <Route path="project" element={<Project />}></Route>
                                    <Route path="board/:projectId" element={<Board />}></Route>
                                    <Route path="user" element={<UserProfile></UserProfile>}></Route>
                                    <Route path="list/:projectId/:boardId" element={<ListContainer />}></Route>
                                    <Route path="list/:projectId/:boardId/:listId/card/:cardId" element={<CardDetails />}></Route>
                                </Routes>
                            </div>
                        </div>
                        <Footer ></Footer>
                    </>
                    }
                
            </UserContext.Provider>
            </DashboardMessageContext.Provider>


    )
}

export default Dashboard;