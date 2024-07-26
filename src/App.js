import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import MovieList from './components/MovieList'; 
import MovieListHeading from './components/MovieListHeading'; 
import SearchBox from './components/SearchBox';
import AddFavourites from './components/AddFavourites';
import RemoveFavourites from './components/RemoveFavourites';

// CORS
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://react-movie-list-app-two.vercel.app/', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  
  // Get movies from OMDB API
  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=7c963a90`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const responseJson = await response.json();
  
      if (responseJson.Search) {
        setMovies(responseJson.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  }

  // Get movie request everytime search value changes
  useEffect (() => {
    getMovieRequest(searchValue);
  }, [searchValue])

  // Write to local storage everytime movie favourites is changed
  useEffect (() => {
    const movieFavourites = JSON.parse(localStorage.getItem('movie-list-favourites')) || [];
    setFavourites(movieFavourites);
  }, []);

  // Add to favourites
  const addFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  // Remove from favourites
  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter((favourite) => favourite.imdbID !== movie.imdbID);
    setFavourites(newFavouriteList);
  }

  // Save to localStorage
  const saveToLocalStorage = (items) => {
    localStorage.setItem('movie-list-favourites', JSON.stringify(items));
  }



  // Render
  return (
    <div className='container-fluid'>
      <div className='rows d-flex flex-column align-items-center my-4'>
        <MovieListHeading heading="Movies Search"/>
        <SearchBox 
          searchValue={searchValue} 
          setSearchValue={setSearchValue}/>
      </div>
      <div className='rows d-flex'>
        <MovieList 
          movies = {movies} 
          handleFavouritesClick={addFavouriteMovie} 
          FavouriteComponent={AddFavourites}/>
      </div>
      <div className='rows d-flex align-items-center mt-4 mb-4'>
        <MovieListHeading heading="Favourites"/>
      </div>
      <div className='rows d-flex'>
        <MovieList 
          movies = {favourites} 
          handleFavouritesClick={removeFavouriteMovie} 
          FavouriteComponent={RemoveFavourites}/>
      </div>
    </div>
  );
};

export default App;