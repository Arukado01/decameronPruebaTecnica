import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";
import type { Inventory, InventoryPayload } from "./inventory.types";

export const useInventories = (hotelId: number) =>
    useQuery<Inventory[]>({
        queryKey: ["inventories", hotelId],
        queryFn: async () =>
            (await api.get(`/hotels/${hotelId}/inventories`)).data,
    });

export const useCreateInventory = (hotelId: number) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: InventoryPayload) => api.post("/inventories", payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["inventories", hotelId] }),
    });
};

export const useUpdateInventory = (hotelId: number) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...payload }: InventoryPayload & { id: number }) =>
            api.put(`/inventories/${id}`, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["inventories", hotelId] }),
    });
};

export const useDeleteInventory = (hotelId: number) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/inventories/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["inventories", hotelId] }),
    });
};

/* catálogos para los selects */
export const useRoomTypes = () =>
    useQuery({ queryKey: ["room_types"], queryFn: () => api.get("/room-types").then(r => r.data) });

export const useAccommodations = () =>
    useQuery({ queryKey: ["accommodations"], queryFn: () => api.get("/accommodations").then(r => r.data) });
