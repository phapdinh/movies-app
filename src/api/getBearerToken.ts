import type { AxiosResponse } from 'axios';
import axiosBase from './baseConfig';
import { queryClient } from '../App';

export default function getBearerToken(signal?: AbortSignal): Promise<AxiosResponse<{ token: string }>> {
    return axiosBase.get('/auth/token', { signal });
}

export function getCurrentBearerToken() {
    return queryClient.getQueryData<AxiosResponse>(['getBearerToken'])?.data?.token;
}