import Navbar from "@/components/nevbar/Navbar";
import { Outlet } from "react-router";

// rafce
const LayoutAdmin = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default LayoutAdmin;
