import { useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Pagination, Stack } from '@mui/material';
import { getMovies, getBearerToken, setBearerToken, getMovieGenres, getCurrentBearerToken } from "./api";
import Loader from "./components/Loader/Loader";
import MovieCard from "./components/MovieCard/MovieCard";

function MovieApp() {
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [selectedGenre, setSelectedGenre] = useState<string | undefined>(undefined);
    const [selectedPage, setSelectedPage] = useState<number | undefined>(undefined);
    const { isFetching: isFetchingBearerToken, error } = useQuery({
        queryKey: ['getBearerToken'],
        queryFn: async ({ signal }) => {
            const response = await getBearerToken(signal);
            setBearerToken(response.data.token);
            return response;
        }
    });
    const { isFetching: isFetchingMovieGenres, data: movieGenres } = useQuery({
        queryKey: ['getMovieGenres'],
        queryFn: async ({ signal }) => {
            const response = await getMovieGenres(signal);
            return response;
        },
        enabled: !!getCurrentBearerToken()
    });
    const { isFetching: isFetchingMovies, error: errorSearchingMovies, refetch, data: moviesData } = useQuery({
        queryKey: ['moviesSearch'],
        queryFn: ({ signal }) => getMovies({ search: searchTerm, genre: selectedGenre, page: selectedPage }, signal),
        enabled: false,
        retry: false,
        gcTime: 0,
    })

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(event.target.value);
    }

    function handleSearchSubmit() {
        setSelectedPage(undefined)
        setTimeout(() => refetch(), 0);
    }

    function handlePageChange(_: React.ChangeEvent<unknown>, page: number) {
        setSelectedPage(page);
        setTimeout(() => refetch(), 0);
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
        <Grid container marginTop={5}>
            {moviesData?.data?.data &&
                (moviesData.data.data.length > 0 ?
                    <Stack>
                        <Grid container spacing={1}>
                            {moviesData.data.data.map((movie) => <MovieCard key={movie.id} rating={movie.rating} posterUrl={movie.posterUrl} title={movie.title} />)}
                        </Grid>
                        {moviesData.data.totalPages > 1 && <Grid container marginTop={7}>
                            <Pagination count={moviesData.data.totalPages} page={selectedPage} onChange={handlePageChange} />
                        </Grid>}
                    </Stack> : <Typography>No movies found</Typography>)}
        </Grid>
    </Grid>;
}

export default MovieApp;