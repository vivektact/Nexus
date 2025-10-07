import axios from "axios";

const BASE_URL = "https://nexus-backend-bmt3.onrender.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});

export default axiosInstance;

