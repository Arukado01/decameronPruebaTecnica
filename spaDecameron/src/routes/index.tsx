import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import HotelsPage from "../pages/HotelsPage";
import InventoriesPage from "../pages/InventoriesPage";

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="hotels" />} />
            <Route path="hotels" element={<HotelsPage />} />
            <Route path="hotels/:hotelId/inventories" element={<InventoriesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
);
export default AppRoutes;
