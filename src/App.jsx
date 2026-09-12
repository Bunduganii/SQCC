import { Route, Routes } from "react-router-dom"
import Login from "./Staff/Auth/Login"

import Citezen from "./Citezen/Citezen"
import Register from "./Staff/Auth/Register"
import StaffPage from "./Staff/Pages/StaffPage"
import Importer from "./Impoters/Importer"
import Sidebar from "./Impoters/components/Sidebar"

const App = () => {
  return (
   <>
   <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/Register" element={<Register/>}/>
    <Route path="/Staff-dash" element={<StaffPage/>}/>
    <Route path="/Citezens" element={<Citezen/>}/>
    <Route path="/Importer" element={<Importer/>}/>
    <Route path="/Importer-menu" element={<Sidebar/>}/>
   
   </Routes>
   </>
  )
}

export default App