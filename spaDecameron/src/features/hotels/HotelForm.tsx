import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateHotel, useUpdateHotel } from "./hotel.api";
import type { Hotel, HotelPayload } from "./hotel.types";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, "Ingrese un nombre válido"),
  nit: z.string().min(3),
  address: z.string().min(3),
  city: z.string().min(2),
  max_rooms: z.number({ invalid_type_error: "Debe ser número" }).min(1),
});
type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  hotel?: Hotel;          // presente  ⇒  editar
}

export default function HotelFormModal({ onClose, hotel }: Props) {
  /* ───── react-hook-form ───── */
  const {
    register,
    handleSubmit,
    formState,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: hotel
      ? // edición
        { ...hotel, max_rooms: hotel.max_rooms }
      : // creación
        { max_rooms: 1 } as Partial<FormData>,
  });

  /* Cuando la prop `hotel` cambie (abrir otro registro) → reset */
  useEffect(() => {
    if (hotel) {
      reset({ ...hotel } as unknown as FormData);
    } else {
      reset({ max_rooms: 1 } as Partial<FormData>);
    }
  }, [hotel, reset]);

  /* ───── mutations ───── */
  const create = useCreateHotel();
  const update = useUpdateHotel();

  const submit = handleSubmit((d) => {
    const payload = d as HotelPayload;
    if (hotel) {
      update.mutate({ id: hotel.id, ...payload }, { onSuccess: onClose });
    } else {
      create.mutate(payload, { onSuccess: onClose });
    }
  });

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40 z-50">
      <form onSubmit={submit} className="card w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">
          {hotel ? "Editar hotel" : "Nuevo hotel"}
        </h2>

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

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {hotel ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
