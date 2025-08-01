// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://nftbackend-qz6p.onrender.com/api',
    headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
