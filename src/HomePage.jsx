import React, { useEffect, useState } from "react";
import poster from "./assets/poster.svg";
import logo from "./assets/showflix.png";
import './App.css';
import MovieCard from "./MovieCard.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { faFire, faHeart, faCircleRight } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const HomePage = () => {
    const API_KEY = 'e524da3241abc4d9425d746634d33332';
    const [movies, setMovies] = useState([]);
    const [carousel, setCarousel] = useState([]);
    const [favoritedTV, setFavoritedTV] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [genreMovies, setGenreMovies] = useState({});
    const [koreanMovies, setKoreanMovies] = useState([]);
    const [hindiMovies, setHindiMovies] = useState([]);
    const [teluguMovies, setTeluguMovies] = useState([]);
    const navigate = useNavigate();
    const fetchStreamingAvailability = async (tmdbId) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers`)
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Main function to search for movies and get details
    const searchMovies = async (title) => {
        navigate('/search', { state: { searchTerm: title } });
    };

    const fetchTrendingMovies = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
        const data = await response.json();
        return data.results;
    };

    const fetchTrendingTVShows = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`);
            if (!response.ok) {
                console.error("Error fetching data");
                return null
            }
            const data = await response.json();
            return data.results;
        }
        catch (error) {
            console.error(error);
        }

    };

    const fetchTopKoreanMovies = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=ko&sort_by=popularity.desc`);
            if (!response.ok) {
                console.error("Error fetching data");
                return null
            }
            const data = await response.json();
            return data.results;
        }
        catch (error) {
            console.error(error);
        }
    }

    const fetchTopHindiMovies = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc`);
            if (!response.ok) {
                console.error("Error fetching data");
                return null

            } else {
                const data = await response.json();
                console.log('Hindi Movies Data:', data);  // Log response data here

                return data.results;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchTopTeluguMovies = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=te&sort_by=popularity.desc`);
            if (!response.ok) {
                console.error("Error fetching data");
                return null
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error(error);
        }

    }
    const combineMovieData = async (movies) => {
        // Check if there are movies to process
        if (!movies.length) return [];

        // Fetch all streaming availability for the given movies in a single batch (if supported)
        const streamingAvailabilityPromises = movies.map(movie => fetchStreamingAvailability(movie.id));
        const streamingResults = await Promise.all(streamingAvailabilityPromises);

        // Combine movie data with streaming availability
        const results = movies.map((movie, index) => {
            const streamingData = streamingResults[index]?.['watch/providers'];

            const providers = streamingData?.results || [];
            return {
                title: movie.title || movie.name,
                year: movie.release_date
                    ? movie.release_date.split('-')[0]
                    : movie.first_air_date
                        ? movie.first_air_date.split('-')[0]
                        : 'Unknown',  // Fallback if both dates are missing                overview: movie.overview,
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                streaming: providers['US'], // Append the streaming data from the results,
                overview: movie.overview
            };
        });


        return results;
    };
    const fetchUpcomingMovies = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`);
        const data = await response.json();
        return data.results;
    };

    const fetchGenres = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        return data.genres;  // Returns an array of genres
    };

    const fetchGenreHits = async (genreId) => {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`);
        const data = await response.json();
        return data.results;  // Returns movies sorted by popularity for the given genre
    };

    const fetchData = async () => {
        try {
            const [trendingMovies, favoritedTVShows, upcomingMoviesData, genres, koreanMovies, hindiMovies, teluguMovies] = await Promise.all([
                fetchTrendingMovies(),
                fetchTrendingTVShows(),
                fetchUpcomingMovies(),
                fetchGenres(),
                fetchTopKoreanMovies(),
                fetchTopHindiMovies(),
                fetchTopTeluguMovies()
            ]);
            const combinedTrendingMovies = await combineMovieData(trendingMovies);
            setCarousel(combinedTrendingMovies);

            const combinedFavoritedTVShows = await combineMovieData(favoritedTVShows);
            setFavoritedTV(combinedFavoritedTVShows);

            const combinedUpcomingMovies = await combineMovieData(upcomingMoviesData);
            setUpcomingMovies(combinedUpcomingMovies);

            const genrePromises = genres.map(async (genre) => {
                const genreMovies = await fetchGenreHits(genre.id);
                const combinedGenreMovies = await combineMovieData(genreMovies);
                return { [genre.name]: combinedGenreMovies }; // Return an object with genre name as key

            });

            const results = await Promise.all(genrePromises);
            const allGenreMovies = Object.assign({}, ...results); // Combine all genre movies into a single object
            setGenreMovies(allGenreMovies);

            const combinedKoreanMovies = await combineMovieData(koreanMovies);
            setKoreanMovies(combinedKoreanMovies);

            const combinedHindiMovies = await combineMovieData(hindiMovies);
            setHindiMovies(combinedHindiMovies);

            const combinedTeluguMovies = await combineMovieData(teluguMovies);
            setTeluguMovies(combinedTeluguMovies);

        } catch (error) {
            console.error(error);
        }
    };




    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchStreamingAvailability();
    }, []);


    return (
        <div className="app">
            <div className="header">
                <img src={logo} alt="logo" height={40} width={150} style={{ alignSelf: "baseline", position: "sticky", cursor: "pointer" }} />
                <div className="search">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        style={{ color: "#ff0000", marginTop: "6px" }}
                        size="lg"
                        onClick={() => searchMovies(searchTerm)}
                        cursor="pointer"
                    />
                </div>
            </div>
            <div className="sub-heading">
                <div className="sub-heading-text">
                    <div className="sub-heading-text-title">
                        <h2 style={{ alignItems: "center", alignSelf: "flex-start", color: "white" }}>
                            FIND MOVIES <br />
                            <span style={{
                                background: "linear-gradient(90deg, rgba(34, 3, 255, 1) 0%, rgba(196, 13, 96, 1) 50%)",
                                WebkitBackgroundClip: "text",
                                color: "transparent"
                            }}>TV SHOWS AND MORE </span>
                        </h2>
                        <p style={{ fontSize: "20px", textAlign: "justify" }}>
                            Your ultimate destination for discovering and exploring an extensive library of movies and TV shows! Whether you’re a film fanatic or a casual viewer, our app provides an intuitive and engaging experience to find the perfect content for any mood.
                        </p>
                    </div>
                </div>
                <img src={poster} alt="poster" />
            </div>

            <div className="carousel">
                <h3 style={{ color: "white" }}> Trending Now <FontAwesomeIcon icon={faFire} style={{ color: "#ffd43b", }} /></h3>
                <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                    {carousel.map((movie) => (
                        <MovieCard key={`${movie.title}-${movie.year}`} movie={movie} />
                    ))}
                </Carousel>
            </div>
            <div className="carousel">
                <h3 style={{ color: "white" }}> Most Favorited TV Shows <FontAwesomeIcon icon={faHeart} style={{ color: "#FFD43B", }} /></h3>
                <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                    {favoritedTV.map((movie) => (
                        <MovieCard key={`${movie.title}-${movie.year}`} movie={movie} />
                    ))}
                </Carousel>
            </div>
            <div className="carousel">
                <h3 style={{ color: "white" }}> Upcoming Movies <FontAwesomeIcon icon={faCircleRight} style={{ color: "#FFD43B", }} /></h3>
                <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                    {upcomingMovies.map((movie) => (
                        <MovieCard key={`${movie.title}-${movie.year}`} movie={movie} />
                    ))}
                </Carousel>
            </div>
            <div className="carousel">
                <h3 style={{ color: "white" }}> Most Favorited Hindi Movies <FontAwesomeIcon icon={faHeart} style={{ color: "#FFD43B", }} /></h3>
                <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                    {hindiMovies.map((movie) => (
                        <MovieCard key={`${movie.title}-${movie.year}`} movie={movie} />
                    ))}
                </Carousel>
            </div>
            <div className="carousel">
                <h3 style={{ color: "white" }}> Most Favorited Telugu Movies <FontAwesomeIcon icon={faHeart} style={{ color: "#FFD43B", }} /></h3>
                <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                    {teluguMovies.map((movie) => (
                        <MovieCard key={`${movie.title}-${movie.year}`} movie={movie} />
                    ))}
                </Carousel>
            </div>
            <div className="carousel">
                <h3 style={{ color: "white" }}> Most Favorited Korean Movies <FontAwesomeIcon icon={faHeart} style={{ color: "#FFD43B", }} /></h3>
                <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                    {koreanMovies.map((movie) => (
                        <MovieCard key={`${movie.title}-${movie.year}`} movie={movie} />
                    ))}
                </Carousel>
            </div>
            {Object.keys(genreMovies).map((genre) => (
                <div className="carousel" key={genre}>
                    <h3 style={{ color: "white" }}> {genre} Movies <FontAwesomeIcon icon={faHeart} style={{ color: "#FFD43B", }} /></h3>
                    <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                        {genreMovies[genre].map((movie) => (
                            <MovieCard key={`${movie.title}-${movie.year}`} movie={movie} />
                        ))}
                    </Carousel>
                </div>
            ))}
            {
                movies.length > 0 ? (
                    <div className="container">
                        {movies.map((movie) => (
                            <MovieCard key={`${movie.title}-${movie.year}`} movie={movie} />
                        ))}
                    </div>
                ) : ""
            }
        </div>
    );
}

export default HomePage;
