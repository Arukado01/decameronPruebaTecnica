import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateHotel } from "./hotel.api";
import type { HotelPayload } from "./hotel.types";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(3),
    nit: z.string().min(5),
    address: z.string().min(5),
    city: z.string(),
    max_rooms: z
        .number({ invalid_type_error: "Debes ingresar un número" })
        .min(1),
});

type FormData = z.infer<typeof schema>;

export default function HotelFormModal({ onClose }: { onClose: () => void }) {
    const { register, handleSubmit, formState } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const mutation = useCreateHotel();
    const { mutate } = mutation;

    const submit = handleSubmit((data) => {
        mutate(data as HotelPayload, { onSuccess: onClose });
    });

    return (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
            <form
                onSubmit={submit}
                className="bg-white p-6 rounded-lg shadow max-w-md w-full space-y-4"
            >
                <h2 className="text-xl font-semibold">Nuevo Hotel</h2>

                <input {...register("name")} placeholder="Nombre" className="input" />
                <input {...register("nit")} placeholder="NIT" className="input" />
                <input {...register("address")} placeholder="Dirección" className="input" />
                <input {...register("city")} placeholder="Ciudad" className="input" />
                <input
                    type="number"
                    {...register("max_rooms", { valueAsNumber: true })}
                    placeholder="Habitaciones Máx."
                    className="input"
                />

                {formState.errors && (
                    <p className="text-red-600 text-sm">
                        {Object.values(formState.errors)[0]?.message as string}
                    </p>
                )}

                <div className="flex justify-end gap-2">
                    <button type="button" className="btn" onClick={onClose}>
                        Cancelar
                    <button type="submit" className="btn btn-primary" disabled={mutation.status === "pending"}>
                        {mutation.status === "pending" ? "Guardando…" : "Guardar"}
                    </button>
                    </button>
                </div>
            </form>
        </div>
    );
}
