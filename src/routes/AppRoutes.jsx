

import Navbar from "@/components/nevbar/Navbar";
import Layout from "@/layouts/Layout";
import CreateUser from "@/pages/admin/CreateUser";
import MainApps from "@/pages/admin/MainApps";
import Homepage from "@/pages/homepage";
import Notfound from "@/pages/Notfound";
import Register from "@/pages/Register";

import { BrowserRouter, Routes, Route, Outlet } from "react-router";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route element={
          <Layout/>
        } >
          <Route path="/" element={<Homepage/>} />
          <Route path="register" element={<Register/>} />
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