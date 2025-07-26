
import { useContext, useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { UserContext } from "../UserContext";
function UserProfile({onTriggerDashboard})
{
    const {loggedInUser} = useContext(UserContext);

    return (
        <>
        <Container>
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                        <Card.Title>{ loggedInUser?.data?.first_name } { loggedInUser?.data?.last_name }</Card.Title>
                <Card.Text>
                {loggedInUser?.data?.email}
                </Card.Text>
                <Button variant="primary">Update Password</Button>
            </Card.Body>
            </Card>
        </Container>
        </>
    )
}

export default UserProfile;