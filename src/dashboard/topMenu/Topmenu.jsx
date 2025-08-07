// Navbar.js
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, NavItem, Container, InputGroup, Button, Form } from "react-bootstrap";
import { Link } from 'react-router-dom'; 
import { Eye, Search } from "lucide-react";
import Select from "react-select";
import { UserContext } from "../UserContext";

export default function Topmenu() {
  const { loggedInUser } = useContext(UserContext);
  useEffect(() => {
    console.log(loggedInUser);
    
  },[])
  
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
  const search = async (e) => {
    e.preventDefault()
    console.log(loggedInUser);
    
  }
  return (
    <Navbar bg="light" expand="lg">
      <div className="container-fluid">
        <Navbar.Brand href="#home" style={{width:"15%"}}>LOGO</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Form onSubmit={search}>
              <Form.Group className="" controlId="formBasicPassword">
              <InputGroup>
                  <Form.Select className="form-control custom-form custom-select">
                    <option>Project</option>
                    <option value="1">Board</option>
                    <option value="2">User</option>
                    <option value="3">Card</option>
                  </Form.Select>
                    <Form.Control className='custom-form' required  type='text' />
                    <Button className="button-primary" type="submit">
                      <Search />
                      </Button>
                  </InputGroup>
              </Form.Group> 
            </Form>
          <Nav className="ms-auto">
            {/* <Nav.Item>
              <Nav.Link href="#home">Board</Nav.Link>
            </Nav.Item> */}
            {/* <Nav.Item>
              <Nav.Link href="#about">About</Nav.Link>
            </Nav.Item> */}
            <span className="user">{ loggedInUser?.data?.first_name[0]}</span>
            <NavDropdown title={ loggedInUser?.data?.first_name +" "+loggedInUser?.data?.last_name} id="nav-dropdown">
              <NavDropdown.Item href="#action1" onClick={navigateProfile}>Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action2">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action3" onClick={logOut}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
