import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for passing HTTP-Only cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;