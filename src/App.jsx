import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import PredictForm from './components/PredictForm';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import 'bootstrap-icons/font/bootstrap-icons.css';


function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
  <Route
    path="/"
    element={
      localStorage.getItem('access') ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/login" />
      )
    }
  />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route
    path="/predict"
    element={
      <PrivateRoute>
        <PredictForm />
      </PrivateRoute>
    }
  />
  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />
</Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
