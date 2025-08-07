import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './AppRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AlertComponent from './shared/Alert';
import 'bootstrap-icons/font/bootstrap-icons.css';
function App() {
  const [isAlertShow, setAlertShow] = useState(false);
  const [alertObject, setAlertObject] = useState({ message: "", alertType: "primary" });
  const [loading, setLoading] = useState(true);
  const messageSender = function (message)
  {
    let alertType = message.status === 200 ? "success" :"danger"
    setAlertObject({ message: message.message, alertType }); 
    setAlertShow(true);
    let removeAlert = setTimeout(function () {
      setAlertShow(false);
    },2000)
  }
  return (
    <GoogleOAuthProvider clientId="919886091004-mdne53v66e3dl718f835g3cn7aj8mb79.apps.googleusercontent.com">
      {isAlertShow ? <span className="appAlert"><AlertComponent param={alertObject} /></span> : null}
      <div className='row'>
        <div className='col-md-12 p-0'>
          <AppRoutes messageSenderAppRoutes={ messageSender } />
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
