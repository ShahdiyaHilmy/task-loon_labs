// Home.js - A React component displaying trending movies and a hero section.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the navigation hook for routing.
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material'; // Import Material UI components for styling and layout.
import Navbar from './Navbar'; // Import the Navbar component.
import arcane from './assets/arcane.png'; // Import image for hero section.
import axios from 'axios'; // Import Axios for fetching data from the API.

export default function Home() {
  // State management using React hooks
  const [movies, setMovies] = useState([]); // Store the list of movies fetched from the API.
  const [loading, setLoading] = useState(true); // Loading state for API fetch.
  const [visibleMovies, setVisibleMovies] = useState(10); // Track number of visible movies.
  
  const navigate = useNavigate(); // useNavigate hook for routing.

  // useEffect hook to fetch movies when the component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=2fd48f3354570f5cdbcc66782807c54e`
        );
        setMovies(response.data.results); // Set fetched movies data to state.
        setLoading(false); // Update loading state after fetch.
      } catch (error) {
        console.error('Error fetching data:', error); // Log any error from API.
        setLoading(false); // Stop loading even if an error occurs.
      }
    };

    fetchMovies(); // Call the function to fetch movies.
  }, []); // Empty dependency array ensures this only runs once when the component mounts.

  // Handle "Load More" button click to reveal more movies.
  const handleLoadMore = () => {
    setVisibleMovies((prev) => prev + 10); // Increase the number of visible movies by 10.
  };

  // Handle "Explore" button click to navigate to the /movies page.
  const handleExploreClick = () => {
    navigate('/movies'); // Use navigate to go to the movies page.
  };

  return (
    <Box>
      <Navbar /> {/* Render the Navbar component */}
      
      {/* Hero Section: Display a welcoming section with an image and text */}
      <Box
        sx={{
          backgroundColor: 'white',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Side: Text section */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '3rem', sm: '4rem', md: '4rem' },
                    mt: -15,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(90deg, #FF8A00, #E52E71)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold',
                    }}
                  >
                    Explore
                  </Box>{' '}
                  Movies <br />
                  smart & Fast
                </Typography>
                <Typography
                  sx={{
                    background: 'black',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    mb: 3,
                  }}
                >
                  Browse trending films, check ratings.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleExploreClick} // Call handleExploreClick on button click.
                  size="large"
                  sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    textTransform: 'none',
                    width: 'fit-content',
                    '&:hover': { backgroundColor: '#333' },
                  }}
                >
                  Explore
                </Button>
              </Box>
            </Grid>

            {/* Right Side: Image section */}
            <Grid item xs={12} md={4} ml={7}>
              <Box
                component="img"
                src={arcane} // Image for the hero section.
                alt="Arcane Illustration"
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Movie Card Grid: Display trending movies in card format */}
      <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Trending Movies
        </Typography>
        
        {/* Display loading text when data is still being fetched */}
        {loading ? (
          <Typography variant="h6">Loading movies...</Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {/* Render movie cards */}
            {movies.slice(0, visibleMovies).map((movie, index) => (
              <Grid item key={index}>
                <Card
                  sx={{
                    width: 200,
                    height: 370,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: 270,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Movie poster image.
                      alt={movie.title}
                      sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        borderRadius: '10px',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" noWrap>
                      {movie.title} {/* Display movie title */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rating: {movie.vote_average.toFixed(1)} | Year:{' '}
                      {movie.release_date?.split('-')[0]} {/* Movie rating and release year */}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Load More Button */}
        {visibleMovies < movies.length && (
          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              onClick={handleLoadMore} // Call handleLoadMore to load more movies.
              sx={{
                backgroundColor: 'black',
                color: 'white',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#333' },
              }}
            >
              Load More
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
