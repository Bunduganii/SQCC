import { BiSupport } from "react-icons/bi"
import { FcApproval } from "react-icons/fc"
import { GiCargoShip } from "react-icons/gi"
import { LuFileInput, LuLayoutDashboard, LuLogOut, LuPlus, LuSettings } from "react-icons/lu"
import { NavLink, useNavigate } from "react-router-dom"
import "./sidebar.css"
import { useEffect } from "react"
import { useState } from "react"
 const navItems = [
    {to:"/importer-dashboard", label:"DashBoard",icon:LuLayoutDashboard,end:true},
    {to:"/shipment", label:"Shipment",icon:GiCargoShip,end:true},
    {to:"/drafts", label:"Drafts",icon:LuFileInput,end:true},
    {to:"/Approved-shipment", label:"Approved-Shipment",icon:FcApproval,end:true},
    {to:"/support", label:"Help",icon:BiSupport,end:true},
   
    ]
const Sidebar = () => {
   const [user,setUser] = useState(null)
   const [loading,setLoading] = useState(true)
   const navigate = useNavigate()
   const handlelogout = () => {
      localStorage.removeItem("token");
      navigate("/")
   }
   useEffect(()=>{
      const token = localStorage.getItem("token")
      if(!token){
         navigate("/")
         return
      }
      fetch("http://localhost:5000/api/me",{
         headers:{Authorization:`Bearer ${token}`}
      })
      .then((res)=>{
         if(!res.ok) throw new Error("invalid session")
            return res.json()
      })
      .then((data)=>{
         if(data.rolee !== "importer"){
            navigate("/")
            return
         }
         setUser(data)
         setLoading(false)
      })
      .catch(()=>{
         localStorage.removeItem("token")
         navigate("/")
      })
   },[])
   if(loading) return <p>Loading...</p>
  return (
   <>
   <aside className="sidebar">
    <div className="sidebar-top">
    <div className="sidebar-brand">
     <div className="sidebar-logo" aria-hidden="true">
        <img src="/images/sqcc-logo.jpeg"/>
     </div>
     <div>
        <div className="title"> {user.full_name}</div>
        <div className="sub-title">Importer Dashboard</div>
     </div>
    </div>
    </div>
    <button className="btn-submit-shipment" onClick={()=> navigate("/shipment")}>
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