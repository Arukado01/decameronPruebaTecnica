import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    useInventories,
    useDeleteInventory,
} from "../features/inventories/inventory.api";
import InventoryFormModal from "../features/inventories/InventoryForm";
import type { Inventory } from "../features/inventories/inventory.types";
import { swalConfirm, swalSuccess } from "../ui/alerts";

export default function InventoriesPage() {
    const { hotelId } = useParams();
    const hid = Number(hotelId);
    const { data, isLoading, error } = useInventories(hid);
    const [open, setOpen] = useState(false);
    const del = useDeleteInventory(hid);
    const [modalInv, setModalInv] = useState<Inventory | null>(null);

    if (isLoading) return <p>Cargando…</p>;
    if (error) return <p className="text-red-600">Error al cargar habitación</p>;

    return (
        <>
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Habitaciones - Hotel #{hid}</h1>
                <button
                    className="btn-primary"
                    onClick={() => setModalInv({} as Inventory)}
                >
                    + Nuevo
                </button>
            </header>

            <div className="w-full overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-card">
                    <thead>
                        <tr className="table-head">
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Acomodación</th>
                            <th className="p-3 text-center">Cantidad</th>
                            <th className="p-3 text-center">Creación</th>
                            <th className="p-3 text-center">Actualización</th>
                            <th className="p-3 text-center w-24">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data!.map((inv) => (
                            <tr key={inv.id} className="even:bg-slate-50 border-b last:border-0">
                                <td className="table-cell">{inv.type.name}</td>
                                <td className="table-cell">{inv.accommodation.name}</td>
                                <td className="table-cell text-center">{inv.quantity}</td>
                                <td className="table-cell text-center">{fmtDate(inv.created_at)}</td>
                                <td className="table-cell text-center">{fmtDate(inv.updated_at)}</td>
                                <td className="table-cell text-center space-x-2">
                                    <button
                                        title="Editar"
                                        className="text-slate-600 hover:text-primary"
                                        onClick={() => setModalInv(inv)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        title="Eliminar"
                                        onClick={async () => {
                                            const ok = await swalConfirm(`Eliminar habitación`);
                                            if (ok) {
                                                del.mutate(inv.id, {
                                                    onSuccess: () => swalSuccess("habitación eliminada"),
                                                });
                                            }
                                        }}
                                    >
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalInv !== null && (
                <InventoryFormModal
                    hotelId={hid}
                    inventory={modalInv.id ? modalInv : undefined}
                    onClose={() => setModalInv(null)}
                />
            )}
        </>
    );
}

/* ----- formatear fecha ----- */
function fmtDate(v: string | Date | null) {
    if (!v) return "";
    const d = v instanceof Date ? v : new Date(v);
    return d.toLocaleString("es-CO", {
        timeZone: "America/Bogota",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}
