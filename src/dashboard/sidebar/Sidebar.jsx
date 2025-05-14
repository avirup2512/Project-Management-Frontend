// Sidebar.js
import "./Sidebar.css"; // Optional custom styles
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const navigateUser = function (e)
  {
    e.preventDefault();
    navigate("/dashboard/user"); 
  }
  const navigateBoard = function (e)
  {
    e.preventDefault();
    navigate("/dashboard"); 
  }
    return (
      <div className="bg-light border-end vh-100" id="sidebar-wrapper" style={{ width: "250px" }}>
        <div className="sidebar-heading p-3 border-bottom fw-bold">My App</div>
        <div className="list-group list-group-flush">
          <a href="#dashboard" className="list-group-item list-group-item-action">Dashboard</a>
          <a href="#profile" className="list-group-item list-group-item-action" onClick={navigateUser}>Profile</a>
          <a href="#profile" className="list-group-item list-group-item-action" onClick={navigateBoard}>Boards</a>
          <a href="#settings" className="list-group-item list-group-item-action">Settings</a>
          <a href="#logout" className="list-group-item list-group-item-action text-danger">Logout</a>
        </div>
      </div>
  );
}
