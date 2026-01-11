import type { AxiosResponse } from 'axios';
import axiosBase from './baseConfig';
import { getCurrentBearerToken } from './getBearerToken';
import { queryClient } from '../App';

export interface Params {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string;
}

interface Movie {
    id: string;
    title: string;
    posterUrl: string;
    rating: string;
}

interface Data {
    data: Movie[];
    totalPages: number;
}

export default function getMovies(params: Params, signal?: AbortSignal): Promise<AxiosResponse<Data>> {
    return axiosBase.get('/movies', { headers: { Authorization: `Bearer ${getCurrentBearerToken()}` }, params, signal });
}