import { Outlet, NavLink } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* sidebar */}
      <aside className="w-full lg:w-64 bg-primary text-white">
        <div className="p-4 text-2xl font-bold">Hotel App</div>
        <nav className="space-y-2 p-4">
          <NavLink to="/hotels" className="block py-1 hover:underline">
            Hoteles
          </NavLink>
        </nav>
      </aside>

      {/* content */}
      <main className="flex-1 p-6 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
