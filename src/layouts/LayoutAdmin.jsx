import Navbar from "@/components/nevbar/Navbar";
import { Outlet } from "react-router";

// rafce
const LayoutAdmin = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <main className="container mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default LayoutAdmin;
