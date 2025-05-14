import { GoogleLogin } from "@react-oauth/google";
import "./Login.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthService from "../service/AuthService";

function Login({messageSenderLogin})
{
    const authService = new AuthService('');
    const navigate = useNavigate();
    const handleSuccess = (credentialResponse) => {
        console.log(credentialResponse);
        
            // jwtDecode
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
                localStorage.setItem('token', e.token);
                navigate("/dashboard");
                messageSenderLogin({message:e.data, status:200})
            }else if (e.status && e.status == 404)
            {
                messageSenderLogin({message:e.data, status:404})
            }
        })
    // You can store the user info or send to backend for auth
    };
    const handleError = () => {
        console.error('Login Failed');
    };
    return (
        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" />
            {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
            </Form.Text> */}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password"/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button className='mb-3 width100' variant="primary" type="submit">
            Submit
            </Button>
            <GoogleLogin onSuccess={handleSuccess} onError={handleError}/>
        <Link className='text-center d-block mt-3' to="/auth/signup">Do not have any account? Create an account</Link>
        </Form>
    )
}

export default Login;