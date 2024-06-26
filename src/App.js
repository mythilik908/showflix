import React, { useEffect, useState } from "react";
import SearchIcon from './search.svg';
import './App.css';
import './MovieCard.jsx'
import MovieCard from "./MovieCard.jsx";

//265db57a

const API_URL = 'http://www.omdbapi.com?apikey=265db57a';

const  App = () => {
    const[movies,setMovies] = useState([]);

    const[searchTerm, setSearchTerm] = useState([]);

   const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search)
   }
   useEffect(() => {
    searchMovies('Dune');
   },[]);

    return(
        <div className="app"> 
            <h1> MovieLand </h1>
            <div className="search">
                <input placeholder="Search for movies" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
                <img src={SearchIcon} alt="search" onClick={() => searchMovies(searchTerm)}></img>
            </div>
            
            {
                movies?.length > 0? (
            <div className="container">
            {movies.map((movie) => (<MovieCard movie ={movie}/>))}
            </div>
                    ) : (
                        <div className="empty">
                        <h2> No movies found!!</h2>
                            </div>
                    )
            }
            </div>
    );
}

export default App;