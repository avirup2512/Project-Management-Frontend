// Sidebar.js
import { useSelector } from "react-redux";
import "./Sidebar.css"; // Optional custom styles
import { useNavigate } from "react-router-dom";
import { CircleUser, FolderKanban, LayoutDashboard, Settings, SquareKanban } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [collasped, setCollasped] = useState(true);
  const navigate = useNavigate();
  const defaultProject = useSelector((p) => p.auth.defaultProject)
  const navigateUser = function (e)
  {
    e.preventDefault();
    navigate("/dashboard/user"); 
  }
  const navigateBoard = function (e)
  {
    console.log(defaultProject);
    
    e.preventDefault();
    navigate("/dashboard/board/"+defaultProject?.id);
  }
  const navigateProject = function (e)
  {
    e.preventDefault();
    navigate("/dashboard/project"); 
  }
    return (
      <div className={`bg-light border-end sidebar-wrapper ${collasped?'collapsed':''}`} id="sidebar-wrapper">
        <div className="sidebar-heading p-3 border-bottom fw-bold" onClick={()=>{setCollasped(!collasped)}}>Menu</div>
        <div className="list-group list-group-flush">
          <a href="#dashboard" className="menu-item list-group-item list-group-item-action">
            <LayoutDashboard size={16}/>
            <span className="ms-1 menuText">Dashboard</span>
          </a>
          <a href="#profile" className="menu-item list-group-item list-group-item-action" onClick={navigateUser}>
            <CircleUser size={16}/>
            <span className="ms-1 menuText">
              Profile</span>
          </a>
          <a href="#profile" className="menu-item list-group-item list-group-item-action" onClick={navigateProject}>
            <FolderKanban size={16}/>
            <span className="ms-1 menuText">
              Project</span></a>
          <a href="#profile" className="menu-item list-group-item list-group-item-action" onClick={navigateBoard}><SquareKanban size={16}/>
            <span className="ms-1 menuText">
              Board</span></a>
          <a href="#settings" className="menu-item list-group-item list-group-item-action">
            <Settings size={16}/>
            <span className="ms-1 menuText">
              Setting</span>
          </a>
          <a href="#logout" className="menu-item list-group-item list-group-item-action text-danger">Logout</a>
        </div>
      </div>
  );
}
