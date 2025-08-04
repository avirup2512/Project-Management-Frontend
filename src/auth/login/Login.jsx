import { GoogleLogin } from "@react-oauth/google";
import "./Login.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthService from "../service/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../AuthSlice";
import { useState } from "react";

function Login({messageSenderLogin})
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const authService = new AuthService('');
    const navigate = useNavigate();
    const handleSuccess = (credentialResponse) => {
        console.log(credentialResponse);
        
        //jwtDecode
        const decoded = jwtDecode(credentialResponse.credential);
        console.log(decoded);
        const param = {};
        param.email = decoded.email;
        param.uniqueIdentifier = decoded.sub;
        param.socialLogin = true;
        authService.login(param)
        .then(function (e) {
            if (e.status && e.status == 200)
            {
                dispatch(setUser(e.data));
                localStorage.setItem('token', e.token);
                navigate("/dashboard");
                messageSenderLogin({ message: e.message, status: 200 });
            }else if (e.status && e.status == 404)
            {
                messageSenderLogin({ message: e.message, status: 404 });
            }
        })
    // You can store the user info or send to backend for auth
    };
    const handleError = () => {
        console.error('Login Failed');
    };
    const login = async (e) => {
        e.preventDefault();
        const loggedIn = await authService.login({ email, password, socialLogin: false });
        if (loggedIn.status && loggedIn.status == 200)
        {
            dispatch(setUser(loggedIn.data));
            localStorage.setItem('token', loggedIn.token);
            navigate("/dashboard");
            messageSenderLogin({ message: loggedIn.message, status: 200 });
        }else if (e.status && e.status == 404)
        {
            messageSenderLogin({ message: e.message, status: 404 });
        }
        
    }
    return (
        <Form onSubmit={login}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" />
            {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
            </Form.Text> */}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={(e) => setPassword(e.target.value)} type="password"/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button className='mb-3 width100' variant="primary" type="submit">
            Login
            </Button>
            <GoogleLogin onSuccess={handleSuccess} onError={handleError}/>
        <Link className='text-center d-block mt-3' to="/auth/signup">Do not have any account? Create an account</Link>
        </Form>
    )
}

export default Login;