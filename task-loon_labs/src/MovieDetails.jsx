import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Chip,
  Stack,
  Avatar,
  Rating,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';

const API_KEY = '2fd48f3354570f5cdbcc66782807c54e';
const API_BASE_URL = 'http://localhost:3001';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logged-in user
    const loggedInUser = localStorage.getItem('userSession') || localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      
      // Check if this movie is in the user's favorites
      axios.get(`${API_BASE_URL}/users/${parsedUser.id}`)
        .then(response => {
          const isFav = response.data.favorites?.some(fav => fav.id === parseInt(id));
          setIsFavorite(isFav);
        })
        .catch(err => console.error('Error checking favorites:', err));
    }

    const fetchMovieData = async () => {
      try {
        const [movieRes, creditsRes, videoRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`),
          axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`),
        ]);

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast.slice(0, 5));
        setError(null);

        const trailer = videoRes.data.results.find(
          (video) => video.site === 'YouTube' && video.type === 'Trailer'
        );
        if (trailer) {
          setTrailerUrl(trailer.key);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load movie details. Please try again later.');
      }
    };

    fetchMovieData();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      setSnackbarMessage('Please log in to add to favorites.');
      setOpenSnackbar(true);
      navigate('/login', { state: { from: `/movie/${id}` } });
      return;
    }

    setLoadingFavorite(true);
    try {
      // Get current user data
      const userRes = await axios.get(`${API_BASE_URL}/users/${user.id}`);
      const currentUser = userRes.data;
      const updatedFavorites = currentUser.favorites ? [...currentUser.favorites] : [];
      
      if (!isFavorite) {
        // Add to favorites
        updatedFavorites.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        });
        setSnackbarMessage('Added to favorites!');
      } else {
        // Remove from favorites
        const index = updatedFavorites.findIndex(fav => fav.id === movie.id);
        if (index !== -1) {
          updatedFavorites.splice(index, 1);
        }
        setSnackbarMessage('Removed from favorites!');
      }

      // Update user in db.json
      await axios.patch(`${API_BASE_URL}/users/${user.id}`, {
        favorites: updatedFavorites
      });

      // Update local state and storage
      setIsFavorite(!isFavorite);
      const updatedUser = { ...currentUser, favorites: updatedFavorites };
      setUser(updatedUser);
      localStorage.setItem('userSession', JSON.stringify(updatedUser));
      
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error updating favorites:', err);
      setSnackbarMessage('Failed to update favorites. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleTrailerClick = () => {
    if (trailerUrl) {
      window.open(`https://www.youtube.com/watch?v=${trailerUrl}`, '_blank');
    }
  };

  if (error) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography color="error" variant="h6" fontWeight="bold">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2} variant="h6">
          Loading movie details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 10, mb: 6 }}>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={4}
        alignItems={{ xs: 'center', md: 'flex-start' }}
      >
        {/* Poster Section */}
        <Box
          sx={{
            width: { xs: '100%', sm: '80%', md: '400px' },
            maxWidth: '100%',
            position: 'relative',
          }}
        >
          {movie.poster_path && (
            <Box>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
              />
              {trailerUrl && (
                <IconButton
                  onClick={handleTrailerClick}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <PlayCircleIcon fontSize="large" />
                </IconButton>
              )}
            </Box>
          )}
        </Box>

        {/* Details Section */}
        <Box flex={1} width="100%">
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              fontWeight="bold"
              sx={{ flexGrow: 1 }}
              gutterBottom
            >
              {movie.title}
            </Typography>
            <IconButton
              onClick={handleFavoriteToggle}
              disabled={loadingFavorite}
              sx={{
                color: isFavorite ? '#ff4081' : 'rgba(0, 0, 0, 0.54)',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: isFavorite ? '#ff79b0' : 'rgba(0, 0, 0, 0.87)',
                  backgroundColor: 'transparent',
                },
              }}
            >
              {loadingFavorite ? (
                <CircularProgress size={24} />
              ) : (
                <FavoriteIcon fontSize="large" />
              )}
            </IconButton>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Release Date: {movie.release_date}
          </Typography>

          <Box display="flex" alignItems="center" mt={1} mb={2}>
            <Rating value={movie.vote_average / 2} precision={0.1} readOnly />
            <Typography variant="body1" ml={2}>
              {movie.vote_average} / 10
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
            {movie.genres.map((genre) => (
              <Chip key={genre.id} label={genre.name} variant="outlined" />
            ))}
          </Stack>

          <Typography variant="body1" paragraph>
            {movie.overview}
          </Typography>

          <Box mt={3}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Top Cast:
            </Typography>
            <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
              {cast.map((actor) => (
                <Box key={actor.cast_id} textAlign="center" width={100}>
                  <Avatar
                    alt={actor.name}
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {actor.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    as {actor.character}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}