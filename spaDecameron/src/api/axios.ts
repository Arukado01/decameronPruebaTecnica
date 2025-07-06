import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
    withCredentials: false,
});

api.interceptors.response.use(
    (r) => r,
    (err) => {
        console.error(err.response?.data || err.message);
        return Promise.reject(err);
    }
);
