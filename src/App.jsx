import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './auth/login/Login'
import Dashboard from './dashboard/dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthGuard from './guard/AuthGuard';
import Auth from './auth/Auth';
import AppRoutes from './AppRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AlertComponent from './shared/Alert';

function App() {
  const [isAlertShow, setAlertShow] = useState(false);
  const [alertObject, setAlertObject] = useState({ message: "", alertType: "primary" });
  const messageSender = function (message)
  {
    setAlertObject({ message: message.message, alertType: "danger" }); 
    setAlertShow(true);
    let removeAlert = setTimeout(function () {
      setAlertShow(false);
    },2000)
  }
  return (
    <GoogleOAuthProvider clientId="919886091004-mdne53v66e3dl718f835g3cn7aj8mb79.apps.googleusercontent.com">
      {isAlertShow ? <AlertComponent param={alertObject} /> : null}
      <div className='row'>
        <div className='col-md-12 p-0'>
          <AppRoutes messageSenderAppRoutes={ messageSender } />
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
