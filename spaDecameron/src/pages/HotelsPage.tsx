import { useState } from "react";
import { useHotels } from "../features/hotels/hotel.api";
import HotelFormModal from "../features/hotels/HotelForm";
import { Link } from "react-router-dom";

export default function HotelsPage() {
    const { data, isLoading, error } = useHotels();
    const [open, setOpen] = useState(false);

    if (isLoading) return <p>Cargando…</p>;
    if (error) return <p className="text-red-600">Error al cargar hoteles</p>;

    return (
        <>
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Hoteles</h1>
                <button className="btn btn-primary" onClick={() => setOpen(true)}>
                    Nuevo Hotel
                </button>
            </header>

            <table className="min-w-full bg-white rounded-lg shadow">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="p-3">Nombre</th>
                        <th className="p-3">Ciudad</th>
                        <th className="p-3">Habitaciones Máx.</th>
                        <th className="p-3">Inventario</th>
                    </tr>
                </thead>
                <tbody>
                    {data!.map((h) => (
                        <tr key={h.id} className="border-b last:border-b-0">
                            <td className="p-3 font-medium">{h.name}</td>
                            <td className="p-3">{h.city}</td>
                            <td className="p-3 text-center">{h.max_rooms}</td>
                            <td className="p-3 text-center">
                                <Link
                                    to={`/hotels/${h.id}/inventories`}
                                    className="text-blue-600 underline"
                                >
                                    {h.inventories_count}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {open && <HotelFormModal onClose={() => setOpen(false)} />}
        </>
    );
}
