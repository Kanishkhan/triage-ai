import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

console.log('API Base URL:', axiosInstance.defaults.baseURL);

export default axiosInstance;
