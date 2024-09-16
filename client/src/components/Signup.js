import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const hobbiesArray = hobbies.split(',').map((hobby) => hobby.trim());
      const res = await axios.post('http://localhost:3001/api/auth/signup', {
        username,
        password,
        name,
        hobbies: hobbiesArray,
        bio,
      });
      localStorage.setItem('token', res.data.token);
      toast.success('User signed up successfully!', { 
        position: 'top-right', 
      });
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard after signup
      }, 1000); // Redirect after 1 second
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Signup failed', {
        position: 'top-right', 
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md max-w-md w-full">
        <Typography variant="h4" className="text-center mb-4">
          Sign Up
        </Typography>
        <form onSubmit={handleSignup} className="space-y-4">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            fullWidth
            label="Hobbies (comma separated)"
            variant="outlined"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
          <TextField
            fullWidth
            label="Bio"
            variant="outlined"
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            className="bg-blue-500 hover:bg-blue-700 text-white"
          >
            Sign Up
          </Button>
        </form>
      </div>
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
};

export default Signup;
