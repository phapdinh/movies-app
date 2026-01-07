import { Paper } from '@mui/material';

interface MovieCardProps {
    title: string;
    posterUrl: string;
    rating: string;
}

export default function MovieCard({ title, posterUrl, rating }: MovieCardProps) {
    return (
        <Paper elevation={3}>
            <img src={posterUrl} alt={title} />
            <h3>{title}</h3>
            <p>Rating: {rating}</p>
        </Paper>
    );
}