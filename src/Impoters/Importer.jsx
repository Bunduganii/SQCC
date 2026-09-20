
import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"


const Importer = () => {
  const navigate = useNavigate()
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)
  
  useEffect(()=>{
  const token = localStorage.getItem("token");
  if (!token){
 navigate("/")
 return
  }
  fetch("http://localhost:5000/api/me",{
    headers: {Authorization:`Bearer ${token}`}
  })
  .then((res)=>{
    if (!res.ok) throw new Error("Inavlid session");
    return res.json();
  })
  .then((data)=>{
    if(data.rolee !== "importer"){
      navigate("/")
      return
    }
    navigate("/Impt-dash")
    setUser(data)
    setLoading(false)
  })
  .catch(()=>{
    localStorage.removeItem("token")
    navigate("/")
  })
  },[])
  const handlelogout = () =>{
    localStorage.removeItem("token")
    navigate("/")
  }
  if (loading) return <p>Loading...</p>
  
  return (
   <>
   <div>
    <h1>Welcome,{user.full_name}</h1>
     <p> Email:{user.email} </p>
     <p> Role:{user.rolee} </p>
     <button onClick={handlelogout}>Logout</button>
   </div>
   </>
  )
}

export default Importer