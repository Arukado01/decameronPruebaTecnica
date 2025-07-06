import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import clsx from "clsx";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      {/* ---------- sidebar ---------- */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 w-60 bg-primary2 text-white z-40",
          "transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-6 py-4 text-2xl font-semibold tracking-wide border-b border-primary">
          Decameron App
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink
            to="/hotels"
            className={({ isActive }) =>
              clsx(
                "block rounded-md px-3 py-2 hover:bg-primary/30",
                isActive && "bg-primary/40"
              )
            }
            onClick={() => setOpen(false)}
          >
            Hoteles
          </NavLink>
        </nav>
      </aside>

      {/* overlay móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ---------- contenido ---------- */}
      <div className="flex-1 flex flex-col lg:ml-60">
        {/* topbar (solo móvil) */}
        <header className="bg-white shadow-sm flex items-center justify-between px-4 py-2 lg:hidden">
          <button
            className="text-2xl text-primary focus:outline-none"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">Decameron App</h1>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
