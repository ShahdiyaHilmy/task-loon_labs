import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if screen size is small
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a user session stored in localStorage
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page after logout
  };

  const toggleDrawer = (open) => {
    setOpenDrawer(open);
  };

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side navigation */}
        <Stack direction="row" spacing={8} alignItems="center">
          <Typography variant="h6" component="div" sx={{ color: 'black' }}>
            Movie App
          </Typography>

          {!isMobile ? (
            <Stack direction="row" spacing={3}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'black' }}>Home</Button>
              </Link>
              <Link to="/movies" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'black' }}>Movie List</Button>
              </Link>
              <Link to="/favorites" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ color: 'black' }}>Favorites</Button>
              </Link>
            </Stack>
          ) : null}
        </Stack>

        {!isMobile ? (
          isLoggedIn ? (
            <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }} onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
                Sign In
              </Button>
            </Link>
          )
        ) : (
          <IconButton
            color="inherit"
            aria-label="menu"
            edge="end"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon sx={{ color: 'black' }} />
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)}>
          <List>
            <ListItem button component={Link} to="/" sx={{ color: 'black' }}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/movies" sx={{ color: 'black' }}>
              <ListItemText primary="Movie List" />
            </ListItem>
            <ListItem button component={Link} to="/favorites" sx={{ color: 'black' }}>
              <ListItemText primary="Favorites" />
            </ListItem>
            {!isLoggedIn && (
              <ListItem button component={Link} to="/login" sx={{ color: 'black' }}>
                <ListItemText primary="Sign In" />
              </ListItem>
            )}
            {isLoggedIn && (
              <ListItem button onClick={handleLogout} sx={{ color: 'black' }}>
                <ListItemText primary="Logout" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
