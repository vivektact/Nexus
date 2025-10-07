import axios from "axios";

const BASE_URL = "https://nexus-backend-bmt3.onrender.com/api/v1";

const axiosInstance = axios.create({
  baseURL: "https://nexus-backend-bmt3.onrender.com/api/v1",
  withCredentials: true, // send cookies with the request
});

export default axiosInstance;

