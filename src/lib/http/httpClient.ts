import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export const setToken = (token: string) => {
  httpClient.defaults.headers.common['Authorization'] = ['Bearer', token].join(' ');
};

export const removeToken = () => {
  httpClient.defaults.headers.common['Authorization'] = null;
};
