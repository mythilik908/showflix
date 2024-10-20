import poster from "./assets/poster.svg";
import logo from "./assets/showflix.png";
import './App.css';
import MovieCard from "./MovieCard.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from 'react-router-dom';

const API_KEY = 'e524da3241abc4d9425d746634d33332';

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


const SearchPage = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm ? location.state.searchTerm : "");
    let [pageNumber, setPageNumber] = useState(1);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [prevTerm, setPrevTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setMovies([]);
        setPageNumber(1);
        searchMovies(location.state?.searchTerm || "");
    }, [location.state?.searchTerm]);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const gotoHome = async (title) => {
        navigate('/');
    };
    const getMovieDetailsTMDb = async (title, pageNumber) => {
        const languageCodes = {
            "english": "en",
            "telugu": "te",
            "spanish": "es",
            "hindi": "hi",
        };
        const lowerCaseTitle = title.toLowerCase();
        let langCode = languageCodes[lowerCaseTitle] || null;

        if (langCode) {
            const langMovies = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${langCode}&with_original_language=${langCode}&page=${pageNumber}`);
            const lang = await langMovies.json();
            return lang.results || [];
        } else {
            const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(lowerCaseTitle)}&page=${pageNumber}`);
            const personResponse = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(lowerCaseTitle)}&page=${pageNumber}`);

            const movies = await movieResponse.json();
            const people = await personResponse.json();
            return [...(movies.results || []), ...(people.results || [])];
        }
    }

    const fetchStreamingAvailability = async (tmdbId, language) => {

        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${API_KEY}&language=${language}&append_to_response=watch/providers`)
            const data = await response.json();
            console.log("Streaming data for movie", tmdbId, data);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const searchMovies = useCallback(async (title) => {
        setHasMore(true);
        setIsLoading(true);
        try {

            const tmdbMovies = await getMovieDetailsTMDb(title, pageNumber);

            if (tmdbMovies.length === 0) {
                setHasMore(false);
                return;
            }
            // Determine the language based on the search term
            let langCode = title ? title.toLowerCase() : "en-US"; // Default to "en-US" if title is empty

            const streamingAvailabilityPromises = tmdbMovies.map(movie => {
                return fetchStreamingAvailability(movie.id, langCode); // Pass the language code
            });

            const streamingResults = await Promise.all(streamingAvailabilityPromises);

            const movieDetails = await Promise.all(tmdbMovies.map(async (movie, index) => {
                const streamingData = streamingResults[index]?.['watch/providers'];
                const providers = streamingData?.results || [];
                const posterPath = movie.poster_path; // Get the poster path directly from TMDb
                return {
                    title: movie.title,
                    year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                    overview: movie.overview,
                    poster: posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null,
                    streaming: providers['US'] // Append the streaming data from the results
                };
            }));
            if (title !== prevTerm) {
                setMovies(movieDetails);
                setPrevTerm(title);
                setPageNumber(1);
            } else {
                setMovies(prevMovies => [...prevMovies, ...movieDetails]);
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
        setPrevTerm(title);

    }, [hasMore, isLoading]);


    const chunks = (movies, chunkSize) => {
        const chunkedArray = [];
        for (let i = 0; i < movies.length; i += chunkSize) {
            chunkedArray.push(movies.slice(i, i + chunkSize));
        }
        return chunkedArray;
    };

    const movieChunks = movies ? chunks(movies, 6) : [];

    useEffect(() => {
        const handleScroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
                searchMovies(searchTerm, pageNumber);
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [searchTerm, pageNumber]);

    return (
        <div>
            <div className="app">
                <div className="header">
                    <img src={logo} alt="logo" height={40} width={150} style={{ alignSelf: "baseline", position: "sticky", cursor: "pointer" }} onClick={gotoHome} />
                    <div className="search">
                        <input
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            style={{ color: "#ff0000", marginTop: "6px" }}
                            size="lg"
                            onClick={() => searchMovies(searchTerm)}
                        />
                    </div>
                </div>
                {movieChunks.length > 0 ?
                    movieChunks.map((chunk, index) => (
                        <div key={index} className="carousel">
                            <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                                {chunk.map((movie) => (
                                    <MovieCard key={`${movie.title}-${movie.year}`} movie={movie} />
                                ))}
                            </Carousel>
                        </div>
                    ))
                    : ""
                }
            </div>
        </div>
    );
}

export default SearchPage;
