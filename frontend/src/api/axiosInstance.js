import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
});

console.log('--- API DEBUG INFO ---');
console.log('VITE_API_BASE_URL:', apiBaseUrl);
console.log('Final BaseURL:', axiosInstance.defaults.baseURL);
console.log('-----------------------');

export default axiosInstance;
