import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard/dashboard';
import AuthGuard from './guard/AuthGuard';
import Auth from './auth/Auth';
import LoginAuthGuard from './guard/LoginAuthGuard';
import AppLayout from './AppLayout';

function AppRoutes({ messageSenderAppRoutes }) {
  const messageSender = function (message)
  {
      messageSenderAppRoutes(message);
  }
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="auth" />}></Route>
          <Route path="auth/*" element={<LoginAuthGuard><Auth messageSenderAuth={ messageSender } /></LoginAuthGuard>}></Route>
          <Route path="dashboard/*" element={<AuthGuard><Dashboard /></AuthGuard>}> </Route>
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default AppRoutes
