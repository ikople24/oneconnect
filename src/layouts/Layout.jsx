import Navbar from "@/components/nevbar/Navbar"
import { Outlet } from "react-router"

const Layout = () => {
  return (
    <div>
        <Navbar/>
    <Outlet/>
    </div>
  )
}
export default Layout