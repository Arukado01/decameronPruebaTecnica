import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import type { Hotel, HotelPayload } from "./hotel.types";
import { swalSuccess } from "../../ui/alerts";

/* ───────────────────────── list ───────────────────────── */
export const useHotels = () =>
    useQuery<Hotel[]>({
        queryKey: ["hotels"],
        queryFn: () => api.get("/hotels").then((r) => r.data),
    });

/* ───────────────────────── create ──────────────────────── */
export const useCreateHotel = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: HotelPayload) => api.post("/hotels", payload),
        onSuccess: async () => {
            await swalSuccess("Hotel creado satisfactoriamente");
            qc.invalidateQueries({ queryKey: ["hotels"] });
        },
    });
};

/* ───────────────────────── update ──────────────────────── */
export const useUpdateHotel = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...payload }: HotelPayload & { id: number }) =>
            api.put(`/hotels/${id}`, payload),
        onSuccess: async () => {
            await swalSuccess("Hotel actualizado");
            qc.invalidateQueries({ queryKey: ["hotels"] });
        },
    });
};

/* ───────────────────────── delete ──────────────────────── */
export const useDeleteHotel = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/hotels/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["hotels"] }),
    });
};
