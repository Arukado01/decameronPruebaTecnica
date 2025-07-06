import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    useInventories,
    useDeleteInventory,
} from "../features/inventories/inventory.api";
import InventoryFormModal from "../features/inventories/InventoryForm";

export default function InventoriesPage() {
    const { hotelId } = useParams();
    const hid = Number(hotelId);
    const { data, isLoading, error } = useInventories(hid);
    const [open, setOpen] = useState(false);
    const del = useDeleteInventory(hid);

    if (isLoading) return <p>Cargando…</p>;
    if (error) return <p className="text-red-600">Error al cargar inventario</p>;

    return (
        <>
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Inventario Hotel #{hid}</h1>
                <button className="btn btn-primary" onClick={() => setOpen(true)}>
                    Nuevo
                </button>
            </header>

            <table className="min-w-full bg-white rounded-lg shadow">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="p-3">Tipo</th>
                        <th className="p-3">Acomodación</th>
                        <th className="p-3">Cantidad</th>
                        <th className="p-3 w-20"> </th>
                    </tr>
                </thead>
                <tbody>
                    {data!.map((inv) => (
                        <tr key={inv.id} className="border-b last:border-b-0">
                            <td className="p-3">{inv.type.name}</td>
                            <td className="p-3">{inv.accommodation.name}</td>
                            <td className="p-3 text-center">{inv.quantity}</td>
                            <td className="p-3 text-center">
                                <button
                                    className="text-red-600"
                                    onClick={() => del.mutate(inv.id)}
                                >
                                    🗑
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {open && <InventoryFormModal hotelId={hid} onClose={() => setOpen(false)} />}
        </>
    );
}
