import Layout from "@/layouts/Layout";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import CreateUser from "@/pages/admin/CreateUser";
import MainApps from "@/pages/admin/MainApps";
import Manageinfo from "@/pages/admin/Manageinfo";
import Homepage from "@/pages/Homepage";
import Notfound from "@/pages/Notfound";
import Register from "@/pages/Register";
import Markerpin from "@/pages/markerpin";
import Markerinformation from "@/pages/markerinformation";
import MapLayerOne from "@/pages/MapLayerOne";
import Dashboard from "@/pages/Dashboard";
import Datatable from "@/pages/admin/Datatable";
import LayoutMapLayerOne from "@/layouts/LayoutMapLayerOne";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          {/* <Route path="createuser" element={<CreateUser/>} /> */}
          <Route path="markerinformation" element={<Markerinformation />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<LayoutMapLayerOne />}>
          <Route path="/map" element={<MapLayerOne />} />
        </Route>

        {/* private */}
        <Route path="admin" element={<LayoutAdmin />}>
          <Route index element={<MainApps />} />
          <Route path="createuser" element={<CreateUser />} />
          <Route path="mainapps" element={<MainApps />} />
          <Route path="manageinfo" element={<Manageinfo />} />
          <Route path="datatable" element={<Datatable />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
