import type { AxiosResponse } from 'axios';
import axiosBase from './baseConfig';
import { getCurrentBearerToken } from './getBearerToken';

interface Data {
    data: {
        id: string;
        title: string;
    }[];
}
export default function getMovieGenres(signal?: AbortSignal): Promise<AxiosResponse<Data>> {
    return axiosBase.get('/genres/movies', { headers: { Authorization: `Bearer ${getCurrentBearerToken()}` }, signal });
}