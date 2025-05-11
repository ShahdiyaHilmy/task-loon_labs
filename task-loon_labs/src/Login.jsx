import React, { useState } from 'react';
import {
  TextField, Button, Typography, Alert, Box, Paper, useMediaQuery, Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const LoginForm = () => {
  // State hooks for handling form input, error messages, and success messages
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Theme and media query for responsiveness
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Redirection logic after login, stores the redirect URL from the previous page or defaults to '/home'
  const redirectTo = location.state?.from || '/home';

  // Handle input change in the form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear errors on input change
    setSuccess(''); // Clear success message on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both username and password are provided
    if (!form.username || !form.password) {
      return setError('Both username and password are required.');
    }

    try {
      // Send a request to the server to get user data by username
      const res = await axios.get(`http://localhost:3001/users?username=${form.username}`);

      // If no user is found with the entered username
      if (res.data.length === 0) {
        return setError('User not found.');
      }

      const user = res.data[0];

      // If the password does not match the stored one
      if (user.password !== form.password) {
        return setError('Incorrect password.');
      }

      // Store user session data in localStorage
      localStorage.setItem('userSession', JSON.stringify(user));

      // Set success message and navigate to the redirect location after a short delay
      setSuccess('Login successful!');
      setTimeout(() => navigate(redirectTo), 1500); // Redirect to the original or default location
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <>
      {/* Navbar component */}
      <Navbar />

      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f9f9f9"
        px={2}
      >
        {/* Paper container for the login form */}
        <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>

          {/* Display error or success messages */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {/* Login form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              margin="normal"
              value={form.username}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              value={form.password}
              onChange={handleChange}
            />

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: '#000',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              Login
            </Button>
          </form>

          {/* Link to navigate to the signup page */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
              sx={{ color: 'primary', textDecoration: 'none' }}
            >
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default LoginForm;
