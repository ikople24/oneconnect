import Navbar from "@/components/nevbar/Navbar";
import { Outlet } from "react-router";

// rafce
const LayoutMapLayerOne = () => {
  return (
    <div className="flex flex-col h-[100vh]">
      <Navbar />
      <div className="flex flex-1">
        <main className="container mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default LayoutMapLayerOne;
