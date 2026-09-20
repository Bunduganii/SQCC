import { Route, Routes } from "react-router-dom"
import Login from "./Staff/Auth/Login"

import Citezen from "./Citezen/Citezen"
import Register from "./Staff/Auth/Register"
import StaffPage from "./Staff/Pages/StaffPage"
import Importer from "./Impoters/Importer"
// import Sidebar from "./Impoters/components/Sidebar"
import Shipment from "./Impoters/Shipment"
import Imptdash from "./Impoters/imptdash"
import Layout from "./Impoters/Layout"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
   <>
   <div><Toaster/></div>
   <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/Register" element={<Register/>}/>
    <Route path="/Staff-dash" element={<StaffPage/>}/>
    <Route path="/Citezens" element={<Citezen/>}/>
    <Route path="/Importer" element={<Importer/>}/>
    {/* <Route path="/Importer-menu" element={<Sidebar/>}/> */}
    
    <Route element={<Layout/>}>
     <Route path="/impt-dash" element={<Imptdash/>}/>
     <Route path="/shipment" element={<Shipment/>}/>
    </Route>
   
   
   </Routes>
   </>
  )
}

export default App