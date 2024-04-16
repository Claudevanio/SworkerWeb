import { baseApiUrl, baseAuthUrl } from '@/utils';
import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    'Content-Type': 'application/json-patch+json',
  }
});

export const authApi = axios.create({
  baseURL: baseAuthUrl,
  headers: {
    'Content-Type': 'application/json-patch+json',
  }
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});