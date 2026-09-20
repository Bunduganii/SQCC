import { Outlet } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import './Layout.css'

const Layout = () => {
  return (
    <>
    <div className="app-layout">
   <Sidebar/>
     <main className="app-content">
    <Outlet/>
    </main>
    </div>
    </>
  )
}

export default Layout