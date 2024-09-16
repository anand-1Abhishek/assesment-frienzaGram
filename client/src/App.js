import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile'; 
import Navbar from './components/Navbar';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:userId" element={<UserProfile />} /> 
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
          
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
