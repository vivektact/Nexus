import axios from 'axios';

// 1. Create a new axios instance with a custom configuration
const axiosInstance = axios.create({
  // Set the base URL for all API requests
  baseURL: 'http://localhost:5000/api/v1', // <-- IMPORTANT: Replace with your actual backend URL
  withCredentials: true,
});


export default axiosInstance;

