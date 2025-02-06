import Navbar from "@/components/nevbar/Navbar";
import { Outlet } from "react-router";

// rafce
const LayoutMapLayerOne = () => {
  return (
    <main className="">
      <div className="flex flex-col h-screen">
          <Navbar />

        <div className="flex flex-1">
          <div className="flex-1 bg-gray-100 p-4">
            <Outlet />
          </div>

          {/* <div class="w-64 bg-gray-200 p-4">
            <h2 class="text-xl font-semibold mb-2">Sidebar</h2>
            <p>This is the sidebar content.</p>
          </div> */}
        </div>
      </div>
    </main>
  );
};
export default LayoutMapLayerOne;
