import axios from "axios";
import { swalError } from "../ui/alerts";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
});

api.interceptors.response.use(
    (r) => r,
    (err) => {
        const { response } = err;
        if (response?.status === 422) {
            const msg =
                response.data?.message ??
                Object.values(response.data?.errors ?? {})[0] ??
                "Datos inválidos";
            swalError(msg);
        } else if (response) {
            swalError("Error del servidor");
        }
        return Promise.reject(err);
    }
);
