import React, { useState } from 'react';
import { TextField, Button, Typography, Alert, Box, Paper, Link } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'; // Import the Navbar component

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectTo = location.state?.from || '/home';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      return setError('All fields are required.');
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return setError('Please enter a valid email address.');
    }

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      // Check for duplicate username
      const res = await axios.get(`http://localhost:3001/users?username=${form.username}`);
      if (res.data.length > 0) {
        return setError('Username already exists. Please choose another.');
      }

      // Save new user
      await axios.post('http://localhost:3001/users', {
        username: form.username,
        email: form.email,
        password: form.password
      });

      setSuccess('Registration successful!');
      setForm({ username: '', email: '', password: '', confirmPassword: '' });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar />

      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f9f9f9"
        px={2}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Register
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Username" name="username"
              variant="outlined" margin="normal"
              value={form.username} onChange={handleChange}
            />
            <TextField
              fullWidth label="Email" name="email" type="email"
              variant="outlined" margin="normal"
              value={form.email} onChange={handleChange}
            />
            <TextField
              fullWidth label="Password" name="password" type="password"
              variant="outlined" margin="normal"
              value={form.password} onChange={handleChange}
            />
            <TextField
              fullWidth label="Confirm Password" name="confirmPassword" type="password"
              variant="outlined" margin="normal"
              value={form.confirmPassword} onChange={handleChange}
            />

            <Button
              type="submit" variant="contained" sx={{ backgroundColor: 'black', color: 'white', mt: 2 }}
              fullWidth
            >
              Register
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{ color: 'primary', textDecoration: 'none' }}
            >
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default RegisterForm;
