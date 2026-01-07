import type { AxiosResponse } from 'axios';
import axiosBase from './baseConfig';

let BEARER_TOKEN = '';

export default function getBearerToken(): Promise<AxiosResponse<{ token: string}>> {
    return axiosBase.get('/auth/token');
}

export function setBearerToken(bearerToken: string) {
    BEARER_TOKEN = bearerToken;
}

export function getCurrentBearerToken() {
    return BEARER_TOKEN;
}