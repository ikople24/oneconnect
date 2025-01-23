import Navbar from "@/components/nevbar/Navbar";
import { Outlet } from "react-router";

// rafce
const LayoutAdmin = () => {
  return (
    <main className="container">
      <Navbar />
      <Outlet />
    </main>
  );
};
export default LayoutAdmin;