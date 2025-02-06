import Navbar from "@/components/nevbar/Navbar";
import { Outlet } from "react-router";

// rafce
const Layout = () => {
  return (
    <>
      <Navbar />
      <hr />
      <Outlet />
    </>
  );
};
export default Layout;
