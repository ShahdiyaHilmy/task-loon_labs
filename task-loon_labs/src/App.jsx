// Importing React library for creating components
import React from 'react';

// Importing necessary components from react-router-dom to enable routing in the app
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing the components that will be used in different routes
import Home from './Home'; // The Home component to be displayed at the root or home page
import MoviesPage from './Movies'; // The MoviesPage component to be displayed at /movies route
import MovieDetails from './MovieDetails'; // The MovieDetails component to show details of a specific movie
import Favorite from './Favorite'; // The Favorite component to show the user's favorite movies
import Register from './Register'; // The Register component for user registration
import Login from './Login'; // The Login component for user authentication

// The App function component is the main entry point of the application
function App() {
  return (
    // The Router component is a wrapper that provides the routing context for the entire app
    // It listens to the URL changes and renders the appropriate component based on the route
    <Router>
      {/* Routes component holds all the defined Route components, mapping paths to their components */}
      <Routes>
        {/* Route for the home page. This renders the Home component when the URL is "/" */}
        <Route path="/" element={<Home />} /> {/* Displays the Home component when the user is on the root route */}
        
        {/* Route for the "/home" path. It also renders the Home component */}
        <Route path="/home" element={<Home />} /> {/* Displays the Home component when the user is on /home path */}
        
        {/* Route for the "/movies" path. It renders the MoviesPage component */}
        <Route path="/movies" element={<MoviesPage />} /> {/* Displays the MoviesPage component when the user is on /movies path */}
        
        {/* Dynamic route for displaying a specific movie's details by movie ID */}
        <Route path="/movie/:id" element={<MovieDetails />} /> {/* Displays the MovieDetails component based on movie ID from the URL */}
        
        {/* Route for the "/favorites" path. It renders the Favorite component */}
        <Route path="/favorites" element={<Favorite />} /> {/* Displays the Favorite component when the user is on /favorites path */}
        
        {/* Route for the "/register" path. It renders the Register component for user sign-up */}
        <Route path="/register" element={<Register />} /> {/* Displays the Register component when the user is on /register path */}
        
        {/* Route for the "/login" path. It renders the Login component for user login */}
        <Route path="/login" element={<Login />} /> {/* Displays the Login component when the user is on /login path */}
      </Routes>
    </Router> // End of Router component, which manages all the routes and URL changes
  );
}

// Exporting the App component as the default export so it can be used in other parts of the app
export default App; // Exports the App component for use in other parts of the application
