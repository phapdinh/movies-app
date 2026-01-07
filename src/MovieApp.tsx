import { useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { Button, Grid, TextField, Typography, Paper } from '@mui/material';
import { getMovies, getBearerToken, setBearerToken } from "./api";
import Loader from "./components/Loader/Loader";
import MovieCard from "./components/MovieCard/MovieCard";

function MovieApp() {
    const [searchTerm, setSearchTerm] = useState('');
    const { isFetching: isFetchingBearerToken, error } = useQuery({
        queryKey: ['getBearerToken'],
        queryFn: async () => {
            const response = await getBearerToken();
            setBearerToken(response.data.token);
            return response;
        }
    });
    const { isFetching: isFetchingMovies, error: errorSearchingMovies, refetch, data: moviesData } = useQuery({
        queryKey: ['moviesSearch', searchTerm],
        queryFn: () => getMovies({ search: searchTerm }),
        enabled: false,
        retry: false,
    })

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(event.target.value);
    }

    function handleSearchSubmit() {
        refetch();
    }

    if (isFetchingBearerToken) return <div>Welcome to movie app...</div>;

    if (isFetchingMovies) return <Loader />;

    if (errorSearchingMovies) return (<div>Error fetching movies. Please submit again.</div>);

    if (error) return <div>Error setting Movies Apps please refresh</div>

    console.log('moviesData', moviesData);

    return <Grid>
        <TextField id="search-movies" label="Search Movies" value={searchTerm} variant="standard" onChange={handleSearchChange} />
        <Button variant="contained" onClick={handleSearchSubmit}>Search</Button>
        {moviesData?.data?.data && (moviesData.data.data.length > 0 ? moviesData.data.data.map((movie) => <MovieCard key={movie.id} rating={movie.rating} posterUrl={movie.posterUrl} title={movie.title} />) : <Typography>No movies found</Typography>)}
    </Grid>;
}

export default MovieApp;