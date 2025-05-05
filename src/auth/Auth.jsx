
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login/Login';
import CreateUser from './createUser/CreateUser';
import './Auth.css';
import { useEffect } from 'react';
function Auth({messageSenderAuth})
{
    useEffect(() => {
        console.log("KJ");
        
    })
    const messageSender = function (message)
    {
        messageSenderAuth(message);
    }
    return (
        <div className='row'>
            <div className='col-md-4'>
                &nbsp;
            </div>
            <div className='col-md-4 box mt-5'>
                <Routes>
                    <Route path="/" element={<Navigate to="login"/>}></Route>
                    <Route path="login" element={<Login messageSenderLogin={messageSender} />}></Route>
                    <Route path="signup" element={<CreateUser/>}></Route>
                </Routes>
            </div>
            <div className='col-md-4'>
                &nbsp;
            </div>
        </div>
    )
}

export default Auth;