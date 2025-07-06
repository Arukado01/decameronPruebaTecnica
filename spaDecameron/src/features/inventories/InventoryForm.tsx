import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useRoomTypes,
    useAccommodations,
    useCreateInventory,
} from "./inventory.api";
import type { InventoryPayload } from "./inventory.types";

const schema = z.object({
    hotel_id: z.number(),
    room_type_id: z.number(),
    accommodation_id: z.number(),
    quantity: z.number().min(1),
});
type FormData = z.infer<typeof schema>;

export default function InventoryFormModal({
    hotelId,
    onClose,
}: {
    hotelId: number;
    onClose: () => void;
}) {
    const { data: types } = useRoomTypes();
    const { data: accs } = useAccommodations();
    const { register, handleSubmit, formState } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { hotel_id: hotelId, quantity: 1 },
    });
    const { mutate, status } = useCreateInventory(hotelId);

    const submit = handleSubmit((d) =>
        mutate(d as InventoryPayload, { onSuccess: onClose })
    );

    return (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
            <form
                onSubmit={submit}
                className="bg-white p-6 rounded-lg shadow w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-semibold">Nuevo inventario</h2>

                <select {...register("room_type_id")} className="input">
                    <option value="">Tipo de habitación…</option>
                    {types?.map((t: any) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>

                <select {...register("accommodation_id")} className="input">
                    <option value="">Acomodación…</option>
                    {accs?.map((a: any) => (
                        <option key={a.id} value={a.id}>
                            {a.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    className="input"
                    placeholder="Cantidad"
                />

                {formState.errors.quantity && (
                    <p className="text-red-600 text-sm">Cantidad inválida</p>
                )}

                <div className="flex justify-end gap-2">
                    <button type="button" className="btn" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={status === "pending"}>
                        {status === "pending" ? "Guardando…" : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
