import axios from 'axios';
import {  QueryClient } from '@tanstack/react-query';

const instance = axios.create({ baseURL: import.meta.env.VITE_BASE_URL });
export const queryClient = new QueryClient()

export default instance;