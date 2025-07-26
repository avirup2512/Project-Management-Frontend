
import { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Row } from "react-bootstrap";
import { UserContext } from "../UserContext";
function UserDefaultProject({onTriggerDashboard})
{
    const {loggedInUser} = useContext(UserContext);

    return (
        <>
        <Container>
            <Row>
                <div className="col-md-12">
                    <h1>Default Project</h1>        
                </div>
           </Row>
        </Container>
        </>
    )
}

export default UserDefaultProject;