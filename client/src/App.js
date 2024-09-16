// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile'; // Import UserProfile
import Navbar from './components/Navbar';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
// setup done
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto px-4">
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Private route: Redirect to login if not authenticated */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:userId" element={<UserProfile />} /> {/* Route for UserProfile */}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}

          {/* Redirect the root path "/" to login if not authenticated */}
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
