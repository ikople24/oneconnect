

import Navbar from "@/components/nevbar/Navbar";
import Layout from "@/layouts/Layout";
import CreateUser from "@/pages/admin/CreateUser";
import MainApps from "@/pages/admin/MainApps";
import Notfound from "@/pages/Notfound";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route element={
          <Layout/>
        } >
          <Route path="/" element={<h1>homepage</h1>} />
          <Route path="about" element={<h1>About page</h1>} />
        </Route>


        {/* private */}
        <Route path="admin" element={
          <>
            <Navbar/>
            <Outlet />
          </>
        } >
          <Route index element={<h1>Admin</h1>} />
          <Route path="createuser" element={<CreateUser/>} />
          <Route path="mainapps" element={<MainApps/>} />
        </Route>


        {/* 404 */}
        <Route path="*" element={<Notfound/>} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes