import { Paper } from '@mui/material';
import './MovieCard.css';

interface MovieCardProps {
    title: string;
    posterUrl: string;
    rating: string;
}

export default function MovieCard({ title, posterUrl, rating }: MovieCardProps) {
    return (
        <Paper elevation={3} className='movie-card'>
            <img src={posterUrl} alt={title} className='poster-image' />
            <h3>{title}</h3>
            <p>Rating: {rating}</p>
        </Paper>
    );
}