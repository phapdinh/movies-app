import type { AxiosResponse } from 'axios';
import axiosBase, { queryClient } from './baseConfig';

export default function getBearerToken(signal?: AbortSignal): Promise<AxiosResponse<{ token: string }>> {
    return axiosBase.get('/auth/token', { signal });
}

export function getCurrentBearerToken() {
    return queryClient.getQueryData<AxiosResponse>(['getBearerToken'])?.data?.token;
}