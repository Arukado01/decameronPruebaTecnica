import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRoomTypes,
  useAccommodations,
  useInventories,
  useCreateInventory,
  useUpdateInventory,
} from "./inventory.api";
import type { Inventory, InventoryPayload } from "./inventory.types";
import { z } from "zod";
import { swalSuccess } from "../../ui/alerts";

/* --------- mapa de reglas --------- */
const allowed: Record<number, number[]> = {
  1: [1, 2],       // Estándar
  2: [3, 4],       // Junior
  3: [1, 2, 3],    // Suite
};

/* --------- esquema --------- */
const schema = z.object({
  hotel_id: z.number(),
  room_type_id: z.number().min(1, "Seleccione un tipo"),
  accommodation_id: z.number().min(1, "Seleccione acomodación"),
  quantity: z.number().min(1, "Cantidad mínima 1"),
}).refine(
  (d) => allowed[d.room_type_id]?.includes(d.accommodation_id),
  { message: "Acomodación no permitida para este tipo" }
);

type FormData = z.infer<typeof schema>;

interface Props {
  hotelId: number;
  onClose: () => void;
  inventory?: Inventory;
}

export default function InventoryFormModal({ hotelId, onClose, inventory }: Props) {
  /* catálogos */
  const { data: types } = useRoomTypes();
  const { data: accs }  = useAccommodations();
  const { data: list }  = useInventories(hotelId);

  /* mutaciones */
  const create = useCreateInventory(hotelId);
  const update = useUpdateInventory(hotelId);

  /* form */
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: inventory
      ? { ...inventory }
      : ({ hotel_id: hotelId, quantity: 1 } as Partial<FormData>),
  });

  /* reinicio valores */
  useEffect(() => {
    if (inventory) reset(inventory as FormData);
    else reset({ hotel_id: hotelId, quantity: 1 } as Partial<FormData>);
  }, [inventory, hotelId, reset]);

  /* tipo seleccionado para filtrar acomodaciones */
  const roomTypeId = watch("room_type_id");

  const accOptions = useMemo(() => {
    if (!accs) return [];
    if (!roomTypeId) return accs;
    return accs.filter((a: { id: number; name: string }) => allowed[roomTypeId]?.includes(a.id));
  }, [accs, roomTypeId]);

  /* submit */
  const submit = handleSubmit((d) => {
    const payload = d as InventoryPayload;

    if (inventory) {
      update.mutate(
        { id: inventory.id, ...payload },
        { onSuccess: () => { swalSuccess("Inventario actualizado").then(onClose); } }
      );
    } else {
      /* buscar duplicado */
      const existing = list?.find(
        (inv) =>
          inv.room_type_id === payload.room_type_id &&
          inv.accommodation_id === payload.accommodation_id
      );

      if (existing) {
        update.mutate(
          {
            id: existing.id,
            ...payload,
            quantity: existing.quantity + payload.quantity,
          },
          { onSuccess: () => { swalSuccess("Cantidad sumada").then(onClose); } }
        );
      } else {
        create.mutate(payload, {
          onSuccess: () => { swalSuccess("Inventario creado").then(onClose); },
        });
      }
    }
  });

  /* --------- UI --------- */
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">
          {inventory ? "Editar inventario" : "Nueva habitación"}
        </h2>

        {/* Tipo */}
        <select
          {...register("room_type_id", { valueAsNumber: true })}
          className="input"
          defaultValue=""
        >
          <option value="" disabled>Tipo de habitación…</option>
          {types?.map((t: { id: number; name: string }) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {/* Acomodación filtrada */}
        <select
          {...register("accommodation_id", { valueAsNumber: true })}
          className="input"
          defaultValue=""
        >
          <option value="" disabled>Acomodación…</option>
          {accOptions.map((a: { id: number; name: string }) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <input
          type="number"
          {...register("quantity", { valueAsNumber: true })}
          className="input"
          placeholder="Cantidad"
        />

        {Object.values(errors)[0] && (
          <p className="text-red-600 text-sm">
            {(Object.values(errors)[0]?.message as string) || "Revise los campos"}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {inventory ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
