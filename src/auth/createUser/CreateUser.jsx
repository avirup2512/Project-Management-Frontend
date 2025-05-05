import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AuthService from '../service/AuthService';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
function CreateUser()
{
    const authService = new AuthService('');
    const navigate = useNavigate();
    const [firstName, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setCnfPassword] = useState('');
    const [formError, setFormError] = useState('');

    const handleSuccess = (credentialResponse) => {
        // jwtDecode
    const decoded = jwtDecode(credentialResponse.credential);
        console.log('User Info:', decoded);
        const param = {};
        param.firstName = decoded.given_name;
        param.lastName = decoded.family_name;
        param.email = decoded.email;
        param.socialLogin = true;
        param.uniqueIdentifier = decoded.sub;
        authService.createUserFromSocialLogin(param)
        .then(function (e) {
            if (e.status && e.status == 200)
            {
                localStorage.setItem('token', e.token);
                navigate("/dashboard");
            }
        })
    // You can store the user info or send to backend for auth
    };

    const handleError = () => {
        console.error('Login Failed');
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if(passwordValidate())
        authService.createUser({firstName,lastName,email,password})
            .then(function (e) {
            console.log(e);
        })
    }
    const passwordValidate = function ()
    {
        const newError = {};
        if (password !== confirmPassword)
        {
            newError.password = "Password does not match";
        }
        setFormError(newError);
        return Object.keys(newError).length === 0;
    }
    return (
        <div className=''>
            <p className='text-center'>Create User</p>
            <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control onChange={(e) => setName(e.target.value)} type="text" required/>
                    {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text> */}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" required onChange={(e)=>setLastName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control onChange={(e) => setCnfPassword(e.target.value)} type="password" />
                    </Form.Group>
                    {formError.password && <div className="text-danger mb-3">{formError.password}</div>}
                    {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group> */}
                    <Button className='mb-3 width100' variant="primary" type="submit">
                        Submit
                    </Button>
                <GoogleLogin onSuccess={handleSuccess} onError={handleError}/>
                <Link className='text-center d-block mt-3' to="/auth/login"> Already have an account? Login</Link>
            </Form>
        </div>
        
    )
}

export default CreateUser;