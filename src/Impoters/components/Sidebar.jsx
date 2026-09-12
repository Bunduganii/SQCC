import { BiSupport } from "react-icons/bi"
import { FcApproval } from "react-icons/fc"
import { GiCargoShip } from "react-icons/gi"
import { LuFileInput, LuLayoutDashboard, LuLogOut, LuPlus, LuSettings } from "react-icons/lu"
import { NavLink, useNavigate } from "react-router-dom"
import "./sidebar.css"
 const navItems = [
    {to:"/importer-dashboard", label:"DashBoard",icon:LuLayoutDashboard,end:true},
    {to:"/shipment-registery", label:"Shipment",icon:GiCargoShip,end:true},
    {to:"/drafts", label:"Drafts",icon:LuFileInput,end:true},
    {to:"/Approved-shipment", label:"Approved-Shipment",icon:FcApproval,end:true},
    {to:"/support", label:"Help",icon:BiSupport,end:true},
    {to:"/settings", label:"Setting",icon:LuSettings,end:true}
    ]
const Sidebar = () => {
   const navigate = useNavigate()
   const handlelogout = () => {
      localStorage.removeItem("token");
      navigate("/")
   }
  return (
   <>
   <aside className="sidebar">
    <div className="sidebar-top">
    <div className="sidebar-brand">
     <div className="sidebar-logo" aria-hidden="true">
        <img src="/images/sqcc-logo.jpeg"/>
     </div>
     <div>
        <div className="title">SQCC Portal</div>
        <div className="sub-title">Importer Dashboard</div>
     </div>
    </div>
    </div>
    <button className="btn-submit-shipment">
        <LuPlus size={18}/>
        Submit A Shipment
        </button>
        <nav className="sidebar-nav">
        {navItems.map(({to,label,icon:Icon,end})=>
        <NavLink
        key={to}
        to={to}
        end={end}
        className={({isActive})=>
            `sidebar-link ${isActive ? "active" : ""}`
        }
        >
            <Icon size={18}/>
            <span>{label}</span>

        </NavLink>
        )}
           
        </nav>
        <div className="sidebar-bottom">
         <NavLink to="/settings" className="sidebar-link">
         <LuSettings size={18}/>
         <span>Setting</span>
         </NavLink>
         <button  className="sidebar-link sidebar-logout" onClick={handlelogout} aria-label="logout">
            <LuLogOut size={18}/>
         </button>
        </div>
   </aside>
   </>
  )
}

export default Sidebar