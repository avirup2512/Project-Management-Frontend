
import { useContext, useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import AuthService from "../../auth/service/AuthService";
function UserProfile({onTriggerDashboard})
{
    const [user, setUser] = useState({});
    const authService = new AuthService();
    useEffect(() => {
        const getUser = async () => {
            let token = localStorage.getItem("token");
            const u = await authService.getUserDetails({token});
            setUser(u);
            console.log(u);
        }
        getUser();
    },[])

    return (
        <>
        <Container>
            <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                        <Card.Title>{ user?.data?.first_name } { user?.data?.last_name }</Card.Title>
                <Card.Text>
                {user?.data?.email}
                </Card.Text>
                <Button variant="primary">Update Password</Button>
            </Card.Body>
            </Card>
        </Container>
        </>
    )
}

export default UserProfile;