import Navbar from "@/components/nevbar/Navbar"
import { Outlet } from "react-router"

// rafce
const Layout = () => {
  return (
    <main className="container">
        <Navbar />
        <hr />
        <Outlet />
    </main>
  )
}
export default Layout