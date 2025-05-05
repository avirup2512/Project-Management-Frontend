// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, NavItem, Container } from "react-bootstrap";
import { Link } from 'react-router-dom'; 

export default function Topmenu() {
  const navigate = useNavigate();
  const logOut = function (e)
  {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/auth");
  }
  const navigateProfile = function (e)
  {
    e.preventDefault();
    navigate("/dashboard/user");  
  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">MyApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item>
              <Nav.Link href="#home">Board</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#about">About</Nav.Link>
            </Nav.Item>
            <NavDropdown title="Account" id="nav-dropdown">
              <NavDropdown.Item href="#action1" onClick={navigateProfile}>Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action2">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action3" onClick={logOut}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
