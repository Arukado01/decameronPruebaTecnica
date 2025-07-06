import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import type { Hotel, HotelPayload } from "./hotel.types";

export const useHotels = () =>
    useQuery<Hotel[]>({
        queryKey: ["hotels"],
        queryFn: async () => (await api.get("/hotels")).data,
    });

export const useCreateHotel = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: HotelPayload) => api.post("/hotels", payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["hotels"] }),
    });
};
