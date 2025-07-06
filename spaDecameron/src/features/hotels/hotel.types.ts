export interface Hotel {
    id: number;
    name: string;
    city: string;
    max_rooms: number;
    inventories_count: number;
    created_at: Date;
    updated_at: Date;
}

export type HotelPayload = Omit<Hotel, "id" | "inventories_count">;
