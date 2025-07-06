import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    useHotels,
    useDeleteHotel,
} from "../features/hotels/hotel.api";
import HotelFormModal from "../features/hotels/HotelForm";
import type { Hotel } from "../features/hotels/hotel.types";
import { swalConfirm, swalSuccess } from "../ui/alerts";
import clsx from "clsx";
import FlashAlert from "../components/FlashAlert";

/* ---------- tipos para ordenar ---------- */
type SortKey = keyof Pick<
    Hotel,
    "name" | "city" | "max_rooms" | "created_at" | "updated_at"
>;
type SortDir = "asc" | "desc" | null;

export default function HotelsPage() {
    const { data, isLoading, error } = useHotels();
    const del = useDeleteHotel();

    /* ----- UI state ----- */
    const [modalHotel, setModalHotel] = useState<Hotel | null>(null);
    const [search, setSearch] = useState("");
    const [cities, setCities] = useState<string[]>([]);
    const [cityOpen, setCityOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortKey | null>(null);
    const [dir, setDir] = useState<SortDir>(null);
    const cityBoxRef = useRef<HTMLDivElement | null>(null);

    /* ----- cerrar dropdown al hacer clic fuera ----- */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (cityBoxRef.current && !cityBoxRef.current.contains(e.target as Node)) {
                setCityOpen(false);
            }
        };
        if (cityOpen) document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [cityOpen]);

    /* ----- lista de ciudades únicas (para el dropdown) ----- */
    const cityOptions = useMemo(() => {
        if (!data) return [];
        return Array.from(new Set(data.map((h) => h.city)));
    }, [data]);

    /* ----- filtrado + orden ----- */
    const rows = useMemo(() => {
        if (!data) return [];

        let out = [...data];

        /* búsqueda por nombre */
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            out = out.filter((h) => h.name.toLowerCase().includes(q));
        }

        /* filtro por ciudad */
        if (cities.length) {
            out = out.filter((h) => cities.includes(h.city));
        }

        /* orden */
        if (sortBy && dir) {
            out.sort((a, b) => {
                const av = a[sortBy] ?? "";
                const bv = b[sortBy] ?? "";
                const cmp =
                    typeof av === "number"
                        ? av - (bv as number)
                        : String(av).localeCompare(String(bv));
                return dir === "asc" ? cmp : -cmp;
            });
        }

        return out;
    }, [data, search, cities, sortBy, dir]);

    /* ----- alternar orden ----- */
    const toggleSort = (key: SortKey) => {
        if (sortBy !== key) {
            setSortBy(key);
            setDir("asc");
        } else {
            setDir(dir === "asc" ? "desc" : dir === "desc" ? null : "asc");
            if (dir === null) setSortBy(null);
        }
    };

    if (isLoading) return <p>Cargando…</p>;
    if (error) return <p className="text-red-600">Error al cargar hoteles.</p>;

    return (
        <>
            {/* --------- encabezado + filtros --------- */}
            <header className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                <h1 className="text-3xl font-bold">Hoteles</h1>

                <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                    {/* búsqueda */}
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre…"
                        className="input lg:w-60"
                    />

                    {/* filtro ciudades */}
                    <div className="relative" ref={cityBoxRef}>
                        <button
                            className={clsx(
                                "btn-outline lg:ml-2",
                                cityOpen && "ring-2 ring-primary/50"
                            )}
                            onClick={() => setCityOpen((p) => !p)}
                        >
                            Buscar Por Ciudad ({cities.length || "Todas"})
                        </button>

                        {cityOpen && (
                            <div className="absolute right-0 z-20 mt-2 w-48 bg-white shadow-card rounded-lg px-3 py-2 space-y-1">
                                {cityOptions.map((c) => (
                                    <label key={c} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={cities.includes(c)}
                                            onChange={(e) =>
                                                setCities((prev) =>
                                                    e.target.checked
                                                        ? [...prev, c]
                                                        : prev.filter((x) => x !== c)
                                                )
                                            }
                                        />
                                        {c}
                                    </label>
                                ))}
                                {cityOptions.length > 1 && (
                                    <button
                                        className="text-xs text-primary mt-1"
                                        onClick={() => setCities([])}
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        className="btn-primary lg:ml-4"
                        onClick={() => setModalHotel({} as Hotel)}
                    >
                        + Nuevo Hotel
                    </button>
                </div>

            </header>

            {/* ---------------- tabla ---------------- */}
            <div className="w-full overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-card">
                    <thead>
                        <tr className="table-head">
                            <Th label="Nombre" sortKey="name" {...{ sortBy, dir, toggleSort }} />
                            <Th label="Ciudad" sortKey="city" {...{ sortBy, dir, toggleSort }} />
                            <Th
                                label="Hab. Máx."
                                sortKey="max_rooms"
                                className="text-center"
                                {...{ sortBy, dir, toggleSort }}
                            />
                            <th className="p-3 text-center">Habitaciones</th>
                            <Th
                                label="Creación"
                                sortKey="created_at"
                                className="text-center"
                                {...{ sortBy, dir, toggleSort }}
                            />
                            <Th
                                label="Edición"
                                sortKey="updated_at"
                                className="text-center"
                                {...{ sortBy, dir, toggleSort }}
                            />
                            <th className="p-3 text-center w-28">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((h) => (
                            <tr key={h.id} className="even:bg-slate-50 border-b last:border-0">
                                <td className="table-cell font-medium">{h.name}</td>
                                <td className="table-cell">{h.city}</td>
                                <td className="table-cell text-center">{h.max_rooms}</td>
                                <td className="table-cell text-center">
                                    <Link
                                        to={`/hotels/${h.id}/inventories`}
                                        title="Editar Habitaciones"
                                        className="inline-flex items-center justify-center px-3 py-1 rounded-md
                               text-primary border border-primary/40 hover:bg-primary/10
                               text-sm font-medium"
                                    >
                                        {h.inventories_count}
                                    </Link>
                                </td>

                                <td className="table-cell text-center">{fmtDate(h.created_at)}</td>
                                <td className="table-cell text-center">{fmtDate(h.updated_at)}</td>

                                <td className="table-cell text-center space-x-2">
                                    <button
                                        className="text-slate-600 hover:text-primary"
                                        title="Editar"
                                        onClick={() => setModalHotel(h)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        title="Eliminar"
                                        onClick={async () => {
                                            const ok = await swalConfirm(
                                                `Eliminar hotel «${h.name}»`
                                            );
                                            if (ok) {
                                                del.mutate(h.id, {
                                                    onSuccess: () => swalSuccess("Hotel eliminado"),
                                                });
                                            }
                                        }}
                                    >
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!rows.length && (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-slate-500">
                                    No hay resultados que coincidan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <FlashAlert>
                <i><strong>Nota:</strong> Para poder editar las habitaciones en el hotel presione <strong>en el botón de editar habitaciones</strong> ubicado en la columna habitaciones de la tabla de hoteles.</i>
            </FlashAlert>

            {/* modal */}
            {modalHotel !== null && (
                <HotelFormModal
                    hotel={modalHotel.id ? modalHotel : undefined}
                    onClose={() => setModalHotel(null)}
                />
            )}
        </>
    );
}

/* ----- encabezado sortable ----- */
interface ThProps {
    label: string;
    sortKey: SortKey;
    sortBy: SortKey | null;
    dir: SortDir;
    toggleSort: (k: SortKey) => void;
    className?: string;
}
function Th({ label, sortKey, sortBy, dir, toggleSort, className }: ThProps) {
    const active = sortBy === sortKey;
    return (
        <th
            className={clsx("p-3 cursor-pointer select-none", className)}
            onClick={() => toggleSort(sortKey)}
        >
            {label}
            {active && (dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "")}
        </th>
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
