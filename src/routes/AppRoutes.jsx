import Layout from "@/layouts/Layout";
import LayoutAdmin from "@/layouts/LayoutAdmin";
// import CreateUser from "@/pages/admin/CreateUser";
// import MainApps from "@/pages/admin/MainApps";
// import Manageinfo from "@/pages/admin/Manageinfo";
import Homepage from "@/pages/Homepage";
// import Notfound from "@/pages/Notfound";
// import Markerinformation from "@/pages/Markerinformation";
// import Dashboard from "@/pages/Dashboard";
// import Datatable from "@/pages/admin/Datatable";
import LayoutMapLayerOne from "@/layouts/LayoutMapLayerOne";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import Map from "@/pages/Map";
// import RegistrationForm from "@/pages/registerpage";
import User from "@/pages/admin/user/User";
import MarkerTypePage from "@/pages/admin/Marker-Type/MarkerType";
import Places from "@/pages/admin/Places/Places";
import AuthGuard from "./AuthGuard";
import RoleGuard from "./RoleGuard";
import Role from "@/enum/role.enum";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          {/* <Route path="createuser" element={<CreateUser/>} /> */}
          {/* <Route path="markerinformation" element={<Markerinformation />} /> */}
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          {/* <Route path="register" element={<RegistrationForm />} /> */}
        </Route>

        <Route element={<LayoutMapLayerOne />}>
          <Route path="/map" element={<Map />} />
        </Route>
        {/* private */}
        <Route element={<AuthGuard />}>
          <Route path="admin" element={<LayoutAdmin />}>
            <Route
              element={
                <RoleGuard requiredRoles={[Role.SUPER_ADMIN, Role.ADMIN]} />
              }
            >
              {/* <Route index element={<MainApps />} /> */}
              <Route path="marker-manage" element={<MarkerTypePage />} />
              <Route path="place-manage" element={<Places />} />
              {/* <Route path="createuser" element={<CreateUser />} />
              <Route path="mainapps" element={<MainApps />} />
              <Route path="manageinfo" element={<Manageinfo />} />
              <Route path="datatable" element={<Datatable />} /> */}
            </Route>
            <Route element={<RoleGuard requiredRoles={[Role.SUPER_ADMIN]} />}>
              <Route path="user-manage" element={<User />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
