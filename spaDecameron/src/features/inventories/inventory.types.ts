export interface Inventory {
    id: number;
    hotel_id: number;
    room_type_id: number;
    accommodation_id: number;
    quantity: number;
    // relaciones devueltas por el backend
    type: { id: number; name: string };
    accommodation: { id: number; name: string };
    created_at: Date;
    updated_at: Date;
}

export type InventoryPayload = Omit<Inventory, "id" | "type" | "accommodation">;
