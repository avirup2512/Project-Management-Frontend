// Sidebar.js
import { useSelector } from "react-redux";
import "./Footer.css"; // Optional custom styles
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Footer() {
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
        <footer>
            <section className="d-flex justify-space-between align-center">
                <Button onClick={() => navigate(-1)} size="sm">Back</Button>
            </section>
        </footer>
  );
}
