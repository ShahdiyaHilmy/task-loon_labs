// Importing necessary libraries and components
import React, { useEffect, useState } from 'react'; // React and hooks
import axios from 'axios'; // Axios for making HTTP requests
import { Link } from 'react-router-dom'; // Link component from React Router for navigation
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material'; // Material UI components for styling
import Navbar from './Navbar'; // Importing Navbar component for the header/navigation

export default function FavoritesPage() {
  // State variables for managing favorites, dialog visibility, and selected movie
  const [favorites, setFavorites] = useState([]); // Stores the list of favorite movies
  const [openDialog, setOpenDialog] = useState(false); // Controls dialog visibility
  const [selectedMovie, setSelectedMovie] = useState(null); // Stores the selected movie for removal

  // Check if user is logged in by checking for a user session in localStorage
  const userSession = JSON.parse(localStorage.getItem('userSession'));

  // Redirect to login if no user session is found
  if (!userSession) {
    window.location.href = '/login'; // Redirects to login if the session is not found
    return null; // Return null to prevent rendering anything if user is not logged in
  }

  // Fetch the user's favorite movies when the component mounts or the user session changes
  useEffect(() => {
    fetchFavorites(); // Function to fetch favorites from the server
  }, [userSession]);  // Refetch favorites whenever the user session changes

  const fetchFavorites = async () => {
    try {
      // Fetching all users' data from the server
      const response = await axios.get(`http://localhost:3001/users`);
      // Find the logged-in user based on their ID stored in the session
      const user = response.data.find((user) => user.id === userSession.id);

      if (user) {
        // Set the favorites for the logged-in user
        setFavorites(user.favorites);  
      }
    } catch (error) {
      // Handling any errors that occur while fetching the favorites
      console.error('Error fetching favorites:', error);
    }
  };

  // Function to open the confirmation dialog for removing a favorite movie
  const handleOpenDialog = (movieId) => {
    setSelectedMovie(movieId); // Set the movie to be deleted
    setOpenDialog(true); // Show the confirmation dialog
  };

  // Function to close the confirmation dialog without deleting
  const handleCloseDialog = () => {
    setOpenDialog(false); // Hide the dialog
    setSelectedMovie(null); // Reset the selected movie to null
  };

  // Function to handle the deletion of a movie from favorites
  const handleConfirmDelete = async () => {
    if (selectedMovie) {
      try {
        // Making a DELETE request to remove the movie from favorites on the server
        await axios.delete(`http://localhost:3001/favorites/${selectedMovie}`);
        // Update the local state to remove the movie from the favorites list
        setFavorites(favorites.filter((movie) => movie.id !== selectedMovie));
      } catch (error) {
        // Handling errors during the delete request
        console.error('Error deleting favorite:', error);
      }
    }
    handleCloseDialog(); // Close the dialog after the deletion
  };

  return (
    <Box>
      {/* Render the Navbar component at the top of the page */}
      <Navbar />

      {/* Main content section with Material UI Container for layout */}
      <Container maxWidth="lg" sx={{ mt: 12, pb: 6, border: 'none' }}>
        {/* Page title */}
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          Your Favorite Movies
        </Typography>

        {/* Display a message if there are no favorite movies */}
        {favorites.length === 0 ? (
          <Typography variant="h6">No movies added to favorites.</Typography>
        ) : (
          // Display the list of favorite movies in a Grid layout
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            {favorites.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                {/* Each movie card */}
                <Card sx={{ maxWidth: 250, borderRadius: 2, boxShadow: 3, position: 'relative' }}>
                  {/* Link to the movie details page */}
                  <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                    {/* Movie poster image */}
                    <CardMedia
                      component="img"
                      height="350"
                      image={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'https://via.placeholder.com/500x750?text=No+Image'
                      }
                      alt={movie.title}
                    />
                  </Link>
                  <CardContent>
                    {/* Movie title */}
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {movie.title}
                    </Typography>

                    {/* Movie rating and release year */}
                    <Typography variant="body2" color="text.secondary">
                      Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} | Year: {movie.release_date?.split('-')[0]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Confirmation Dialog for removing a favorite movie */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {/* Dialog title */}
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: 'text.primary' }}>
          Confirm Removal
        </DialogTitle>
        {/* Dialog content */}
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Are you sure you want to remove this movie from your favorites?
          </Typography>
        </DialogContent>
        {/* Dialog actions (Cancel and Confirm buttons) */}
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          {/* Cancel button */}
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="outlined"
            sx={{
              marginRight: '10px',
              padding: '10px 20px',
              borderRadius: '20px',
              textTransform: 'capitalize',
              color: 'black',
              borderColor: 'black',
            }}
          >
            Cancel
          </Button>

          {/* Confirm button */}
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              padding: '10px 20px',
              borderRadius: '20px',
              textTransform: 'capitalize',
              backgroundColor: 'black',
              color: 'white',
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
