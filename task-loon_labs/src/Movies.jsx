import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Pagination,
  MenuItem,
  Popper,
  Paper,
  ClickAwayListener,
} from '@mui/material';
import Navbar from './Navbar';
import axios from 'axios';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const [filterGenre, setFilterGenre] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterRating, setFilterRating] = useState('');

  const API_KEY = '2fd48f3354570f5cdbcc66782807c54e';

  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => (2025 - i).toString());
  const ratings = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  // Fetch recent searches from the local DB (json-server)
  const fetchRecentSearches = async () => {
    try {
      const res = await axios.get('http://localhost:3001/searches?_sort=timestamp&_order=desc&_limit=5'); // Get 5 recent searches
      setRecentSearches(res.data);
    } catch (err) {
      console.error('Error fetching recent searches:', err);
    }
  };

  // Save search query to the DB (json-server)
  const saveSearchQuery = async (query, genre, year, rating) => {
    try {
      await axios.post('http://localhost:3001/searches', {
        query,
        genre,
        year,
        rating,
        timestamp: new Date().toISOString(),
      });
      fetchRecentSearches(); // Refresh recent searches after saving a new search
    } catch (err) {
      console.error('Error saving search query:', err);
    }
  };

  useEffect(() => {
    fetchRecentSearches(); // Fetch recent searches when component mounts
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url;
        let response;

        if (submittedQuery) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${submittedQuery}&page=${page}`;
          response = await axios.get(url);

          let filteredResults = response.data.results;

          if (selectedGenre) {
            filteredResults = filteredResults.filter((movie) =>
              movie.genre_ids.includes(parseInt(selectedGenre))
            );
          }

          if (selectedYear) {
            filteredResults = filteredResults.filter(
              (movie) => movie.release_date?.startsWith(selectedYear)
            );
          }

          if (selectedRating) {
            filteredResults = filteredResults.filter(
              (movie) => movie.vote_average >= parseFloat(selectedRating)
            );
          }

          setMovies(filteredResults);
          setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
        } else {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}${
            selectedGenre ? `&with_genres=${selectedGenre}` : ''
          }${selectedYear ? `&primary_release_year=${selectedYear}` : ''}${
            selectedRating ? `&vote_average.gte=${selectedRating}` : ''
          }`;

          response = await axios.get(url);
          setMovies(response.data.results);
          setTotalPages(response.data.total_pages > 500 ? 500 : response.data.total_pages);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [submittedQuery, page, selectedGenre, selectedYear, selectedRating]);

  const handleSearchFieldFocus = (event) => {
    setAnchorEl(event.target);
  };

  const handleSearchSuggestionClick = (query) => {
    setSearchQuery(query);
    setSubmittedQuery(query);
    fetchRecentSearches(); 
  };

  const handleClickAway = (event) => {
    if (anchorEl && anchorEl.contains(event.target)) {
      return;
    }
    setAnchorEl(null);
  };

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 10, pb: 6 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ ml: 5 }} gutterBottom>
          Explore Movies
        </Typography>

        <Box
        sx={{
          mt: 3,
          mb: 4,
          px: { xs: 2, sm: 5 }, 
          }}
        >
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <TextField
            label="Search By Title"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFieldFocus}
            fullWidth
            sx={{ flex: 1, minWidth: { xs: '100%', md: '200px' } }}
          />
          <TextField
            select
            label="Genre"
            variant="outlined"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            sx={{ minWidth: 150, width: { xs: '100%', sm: 'auto' } }}
          >
            <MenuItem value="">All</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Year"
            variant="outlined"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}
          >
            <MenuItem value="">All</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Rating"
            variant="outlined"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}
          >
            <MenuItem value="">All</MenuItem>
            {ratings.map((rating) => (
              <MenuItem key={rating} value={rating}>
                {rating}+
              </MenuItem>
            ))}
          </TextField>
          <Box
            component="button"
            onClick={() => {
              setPage(1);
              setSubmittedQuery(searchQuery);
              setSelectedGenre(filterGenre);
              setSelectedYear(filterYear);
              setSelectedRating(filterRating);
        
              saveSearchQuery(searchQuery, filterGenre, filterYear, filterRating);
              setFilterGenre(filterGenre);
              setFilterYear(filterYear);
              setFilterRating(filterRating);
            }}
            sx={{
              px: 3,
              height: '56px',
              border: 'none',
              borderRadius: 1,
              backgroundColor: 'black',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              alignSelf: { xs: 'stretch', sm: 'auto' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Filter
          </Box>
          </Box>
          </Box>

        {/* Recent Searches Popper */}
        <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
          <ClickAwayListener onClickAway={handleClickAway}>
            <Paper sx={{ maxHeight: 200, overflowY: 'auto', width: 200 }}>
              {recentSearches
                .slice(0, 5) // Limit to 5 recent searches
                .map((search) => (
                  <MenuItem key={search.id} onClick={() => handleSearchSuggestionClick(search.query)}>
                    {search.query}
                  </MenuItem>
                ))}
            </Paper>
          </ClickAwayListener>
        </Popper>
        
        {loading ? (
          <Typography variant="h6">Loading movies...</Typography>
        ) : movies.length === 0 ? (
          <Typography variant="h6">No movies found.</Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center">
              {movies.map((movie) => (
                <Grid item key={movie.id}>
                  <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      width: 200,
                      height: 370,
                      borderRadius: 2,
                      boxShadow: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
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
                        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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
                        {movie.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rating: {movie.vote_average.toFixed(1)} | Year:{' '}
                        {movie.release_date?.split('-')[0]}
                      </Typography>
                    </CardContent>
                    </Card>
                    </Link>
                </Grid>
              ))}
            </Grid>

            <Box mt={4} display="flex" justifyContent="center">
            <Pagination
  count={totalPages}
  page={page}
  onChange={(e, value) => setPage(value)}
  variant="outlined"
  color="primary"
  sx={{
    '& .MuiPaginationItem-root': {
      color: 'black',
      borderColor: 'black',
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: '#e0e0e0', 
      },
    },
    '& .Mui-selected': {
      backgroundColor: 'black',
      color: 'white',  
      borderColor: 'black',
      '&:hover': {
        backgroundColor: 'black', 
      },
    },
  }}
/>
</Box>

          </>
        )}
      </Container>
    </Box>
  );
}
