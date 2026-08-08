import { Route, Routes } from "react-router-dom"
import Login from "./Staff/Auth/Login"
import dashStaff from "./Staff/Pages/dashStaff"
import Citezen from "./Citezen/Citezen"
import Register from "./Staff/Auth/Register"

const App = () => {
  return (
   <>
   <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/Register" element={<Register/>}/>
    <Route path="/Staff-dash" element={<dashStaff/>}/>
    <Route path="/Citezens" element={<Citezen/>}/>
   </Routes>
   </>
  )
}

export default App