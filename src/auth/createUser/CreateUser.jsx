import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AuthService from '../service/AuthService';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "../login/Login.css"
import { InputGroup } from 'react-bootstrap';
import { CircleCheck, Eye, EyeOff, Info } from 'lucide-react';
import { motion } from 'framer-motion';
function CreateUser()
{
    const authService = new AuthService('');
    const navigate = useNavigate();
    const [firstName, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setCnfPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordSetBool, setPasswordSetBool] = useState(false);
    const [passwordLength, setPasswordLength] = useState(0);
    const [passwordSpecialCharacter, setPasswordSpecialCharacter] = useState(0);
    const [passwordUpperCase, setPasswordUpperCase] = useState(0);

    const handleSuccess = (credentialResponse) => {
        // jwtDecode
    const decoded = jwtDecode(credentialResponse.credential);
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
        authService.createUser({firstName,lastName,email,password})
            .then(function (e) {
            if (e.status && e.status == 200)
            {
                localStorage.setItem('token', e.token);
                navigate("/dashboard");
            }
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
    const nextToPassword = () => {
        if (firstName.length > 0 && lastName.length > 0 && email.length > 0)
        {
            setPasswordSetBool(true);
        } else {
            handleSubmit()
        }
    }
    const hasSpecialChar = (str)=> {
        const regex = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/;
        return regex.test(str);
    }
    const hasUppercase = (str)=> {
        const regex = /[A-Z]/;
        return regex.test(str);
    }
    const hasDigit = (str)=> {
        const regex = /\d/;
        return regex.test(str);
    }
    const passwordChange = (e) => {
        setPassword(e.target.value);
        const newError = {};
        if (e.target.value.length == 0)
        {
            setPasswordLength(0);
            setPasswordSpecialCharacter(0);
            setPasswordUpperCase(0);
            return;
        }
        if (e.target.value.length < 8)
        {
            setPasswordLength(-1);
        } else {
            setPasswordLength(1);
        }
        if (!hasSpecialChar(e.target.value))
        {
            setPasswordSpecialCharacter(-1)
        } else {
            setPasswordSpecialCharacter(1)
        }
        if (!hasUppercase(e.target.value))
        {
            setPasswordUpperCase(-1)
        } else {
            setPasswordUpperCase(1)
        }
    }
    return (
        <motion.div className='box'
         initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <h3 className='text-center fw-bold'>Sign up</h3>
            <Form onSubmit={handleSubmit}>
                {
                    !passwordSetBool && 
                    <>
                    <Form.Group className="mb-2">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control className='custom-form' required onChange={(e) => setName(e.target.value)} type="text"/>
                    {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text> */}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control className='custom-form' type="text" required onChange={(e)=>setLastName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control className='custom-form' onChange={(e) => setEmail(e.target.value)} type="email" required />
                    </Form.Group>
                    </>
                }
                {
                    passwordSetBool && 
                    <>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control className='custom-form' required onChange={passwordChange} type={showPassword ? "text" : "password"} />
                                <Button
                                variant="outline-secondary"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                                >
                                {showPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <div className='mb-3'>
                            <div className={`info d-flex align-center ${passwordLength == 0 ? 'text-info' : passwordLength > 0 ? 'text-success' : 'text-danger'}`}>
                                {
                                    passwordLength > 0 && <CircleCheck size={16} color="#198754" />
                                }
                                {
                                    passwordLength <= 0 && <Info size={16} />
                                }
                                <span className='ms-1'> Password should has atleast 8 characters. </span>
                            </div>
                            <div className={`info d-flex align-center ${passwordSpecialCharacter == 0 ? 'text-info' : passwordSpecialCharacter > 0 ? 'text-success' : 'text-danger'}`}>
                                {
                                    passwordSpecialCharacter > 0 && <CircleCheck size={16} color="#198754" />
                                }
                                {
                                    passwordSpecialCharacter <= 0 && <Info size={16} />
                                }
                                <span className='ms-1'>Password should have atleast one special character.</span>
                                </div>
                            <div className={`info d-flex align-center ${passwordUpperCase == 0 ? 'text-info' : passwordUpperCase > 0 ? 'text-success' : 'text-danger'}`}>
                                {
                                    passwordUpperCase > 0 && <CircleCheck size={16} color="#198754" />
                                }
                                {
                                    passwordUpperCase <= 0 && <Info size={16} />
                                }
                                <span className='ms-1'>Password should have atleast one Uppercase.</span>
                                </div>
                        </div>
                    </>
                }
                    
                {
                    !passwordSetBool && <Button onClick={nextToPassword} className='mb-3 width100 button-primary' variant="primary" type="submit">
                        Next Set Password
                    </Button>
                }
                {
                    passwordSetBool &&
                    <Button className='mb-3 width100 button-primary' variant="primary" type="submit">
                        Submit
                    </Button>
                }
                    {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group> */}
                    
                <GoogleLogin onSuccess={handleSuccess} onError={handleError}/>
                <Link className='text-center d-block mt-3' to="/auth/login"> Already have an account? Login</Link>
            </Form>
        </motion.div>
        
    )
}

export default CreateUser;