import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5 // Adjust as needed
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
const getServiceLink = (providerName, movieTitle) => {
    const serviceUrls = {
        'Netflix': `https://www.netflix.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        "Netflix basic with Ads": `https://www.netflix.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Amazon Video': `https://www.amazon.com/s?k=${encodeURIComponent(movieTitle)}`, // Search link
        'Amazon Prime Video': `https://www.amazon.com/s?k=${encodeURIComponent(movieTitle)}`, // Search link
        'Amazon Prime Video with Ads': 'https://www.amazon.com/adlp/freevee', // Freevee hosts Prime Video with Ads
        'Hulu': `https://www.hulu.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Disney Plus': `https://www.disneyplus.com/search/${encodeURIComponent(movieTitle)}`, // Search link
        'HBO Max': `https://www.hbomax.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Paramount+': `https://www.paramountplus.com/search/?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Apple TV': `https://tv.apple.com/search?term=${encodeURIComponent(movieTitle)}`, // Search link
        'Fandango At Home': `https://www.vudu.com/content/movies/search?minVisible=0&returnUrl=%252Fcontent%252Fmovies%252F404&searchString=${encodeURIComponent(movieTitle)}`,
        'Vudu': `https://www.vudu.com/content/movies/search?minVisible=0&returnUrl=%252Fcontent%252Fmovies%252F404&searchString=${encodeURIComponent(movieTitle)}`,
        'Peacock': `https://www.peacocktv.com/search?query=${encodeURIComponent(movieTitle)}`, // Search link
        'Roku': `https://www.roku.com/streaming?search=${encodeURIComponent(movieTitle)}`, // Search link
        'BBC iPlayer': `https://www.bbc.co.uk/iplayer/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Brightcove': 'https://www.brightcove.com/',
        'MGM': 'https://www.mgm.com/',
        'Crunchyroll': `https://www.crunchyroll.com/search?query=${encodeURIComponent(movieTitle)}`, // Search link
        'YouTube': `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle)}`, // Search link
        'Starz': `https://www.starz.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Showtime': `https://www.sho.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Discovery+': `https://www.discoveryplus.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Tubi TV': `https://tubitv.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Sling TV': `https://www.sling.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'StarzPlay': `https://www.starzplay.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Amazon Freevee': 'https://www.amazon.com/adlp/freevee', // Direct link
        'Google Play Movies': `https://play.google.com/store/search?q=${encodeURIComponent(movieTitle)}&c=movies`, // Search link
        'iTunes': `https://www.apple.com/itunes/search/?term=${encodeURIComponent(movieTitle)}`, // Search link
        'Microsoft Store': `https://www.microsoft.com/en-us/search/explore?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Sony PlayStation': `https://store.playstation.com/search/${encodeURIComponent(movieTitle)}`, // Search link
        'Kanopy': `https://www.kanopy.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Criterion Channel': `https://www.criterionchannel.com/search?query=${encodeURIComponent(movieTitle)}`, // Search link
        'Vudu Movies on Us': `https://www.vudu.com/content/browse/search/?search=${encodeURIComponent(movieTitle)}`, // Search link
        'AMC on Demand': `https://www.amcplus.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'BritBox': `https://www.britbox.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Hoopla': `https://www.hoopladigital.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'FlixFling': `https://www.flixfling.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Spectrum On Demand': `https://ondemand.spectrum.net/search/?q=${encodeURIComponent(movieTitle)}`, // Search link
        'fuboTV': `https://www.fubo.tv/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Max': `https://www.max.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
        'Max Amazon Channel': `https://www.amazon.com/gp/video/storefront/ref=atv_dp_amz_ch_max`, // Direct link
        'Max VOD': `https://www.max.com/search?q=${encodeURIComponent(movieTitle)}`, // Search link
    };

    if (serviceUrls[providerName]) {
        return serviceUrls[providerName];
    }
    return '#';
};

const MovieCard = ({ movie }) => {
    return (
        <div className="movie">
            <div>
                <h3 style={{ color: 'white', fontSize: "15px" }}>{movie.title}</h3>
                <p>{movie.year}</p>
                <p className='movie-body' style={{ color: 'white', fontSize: "11px" }}>{movie.overview}</p>
            </div>

            <div>
                <img
                    src={movie.poster !== null ? movie.poster : 'http://via.placeholder.com/400'}
                    alt={movie.title}
                />
            </div>

            {movie.streaming?.flatrate && movie.streaming.flatrate.length > 0 ? (
                <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                    {movie.streaming.flatrate.map((streamingService) => (
                        <span key={streamingService.provider_id}>
                            {streamingService.logo_path ? (
                                <a href={getServiceLink(streamingService.provider_name, movie.title)}>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${streamingService.logo_path}`}
                                        alt={streamingService.provider_name}
                                        style={{ width: '30px', height: 'auto' }} // Adjust size as needed
                                    />
                                </a>
                            ) : (
                                <span>No logo available</span> // Fallback if logo_path is not available
                            )}
                        </span>
                    ))}
                </Carousel>
            ) : (
                <>
                    {movie.streaming?.buy && movie.streaming.buy.length > 0 ? (
                        <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                            {movie.streaming.buy.map((streamingService) => (
                                <span key={streamingService.provider_id}>
                                    {streamingService.logo_path ? (
                                        <a href={getServiceLink(streamingService.provider_name, movie.title)}>
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${streamingService.logo_path}`}
                                                alt={streamingService.provider_name}
                                                style={{ width: '30px', height: 'auto' }} // Adjust size as needed
                                            />
                                        </a>
                                    ) : (
                                        <span>No logo available</span> // Fallback if logo_path is not available
                                    )}
                                </span>
                            ))}
                        </Carousel>
                    ) : (
                        <>
                            {movie.streaming?.rent && movie.streaming.rent.length > 0 ? (
                                <Carousel responsive={responsive} draggable={true} keyBoardControl={true}>
                                    {movie.streaming.rent.map((streamingService) => (
                                        <span key={streamingService.provider_id}>
                                            {streamingService.logo_path ? (
                                                <a href={getServiceLink(streamingService.provider_name, movie.title)}>
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w500${streamingService.logo_path}`}
                                                        alt={streamingService.provider_name}
                                                        style={{ width: '30px', height: 'auto' }} // Adjust size as needed
                                                    />
                                                </a>
                                            ) : (
                                                <span>No logo available</span> // Fallback if logo_path is not available
                                            )}
                                        </span>
                                    ))}
                                </Carousel>
                            ) : (
                                " "
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}




export default MovieCard;
