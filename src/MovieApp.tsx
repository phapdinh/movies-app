import { useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { getMovies, getBearerToken, setBearerToken, getMovieGenres, getCurrentBearerToken } from "./api";
import Loader from "./components/Loader/Loader";
import MovieCard from "./components/MovieCard/MovieCard";

function MovieApp() {
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [selectedGenre, setSelectedGenre] = useState<string | undefined>(undefined);
    const { isFetching: isFetchingBearerToken, error } = useQuery({
        queryKey: ['getBearerToken'],
        queryFn: async () => {
            const response = await getBearerToken();
            setBearerToken(response.data.token);
            return response;
        }
    });
    const { isFetching: isFetchingMovieGenres, data: movieGenres } = useQuery({
        queryKey: ['getMovieGenres'],
        queryFn: async () => {
            const response = await getMovieGenres();
            return response;
        },
        enabled: !!getCurrentBearerToken()
    });
    const { isFetching: isFetchingMovies, error: errorSearchingMovies, refetch, data: moviesData } = useQuery({
        queryKey: ['moviesSearch', searchTerm],
        queryFn: () => getMovies({ search: searchTerm, genre: selectedGenre }),
        enabled: false,
        retry: false,
        staleTime: 0,
        gcTime: 0,
    })

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(event.target.value);
    }

    function handleSearchSubmit() {
        refetch();
    }

    if (isFetchingBearerToken || isFetchingMovieGenres) return <div>Welcome to movie app...</div>;

    if (isFetchingMovies) return <Loader />;

    if (errorSearchingMovies) return (<div>Error fetching movies. Please submit again.</div>);

    if (error) return <div>Error setting Movies Apps please refresh</div>

    return <Grid>
        <Grid container>
            <TextField id="search-movies" label="Search Movies" value={searchTerm} variant="standard" onChange={handleSearchChange} />
            <FormControl className="genre-selector">
                <InputLabel id="genre-selector-label">Genre</InputLabel>
                <Select
                    labelId="genre-selector-label"
                    id="genre-select"
                    value={selectedGenre}
                    label="Genre"
                >
                    {movieGenres?.data?.data.map((genre) => (
                        <MenuItem key={genre.id} value={genre.title} onClick={() => setSelectedGenre(genre.title)}>{genre.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSearchSubmit}>Search</Button>
            {moviesData?.data?.data && <Typography>Found {moviesData.data.data.length} movies</Typography>}
        </Grid>
        <Grid container>
            {moviesData?.data?.data &&
                (moviesData.data.data.length > 0 ? moviesData.data.data.map((movie) => <MovieCard key={movie.id} rating={movie.rating} posterUrl={movie.posterUrl} title={movie.title} />) : <Typography>No movies found</Typography>)}
        </Grid>
    </Grid>;
}

export default MovieApp;