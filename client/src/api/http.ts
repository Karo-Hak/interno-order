import axios from 'axios';

export const http = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL, // например, http://localhost:3000
});
