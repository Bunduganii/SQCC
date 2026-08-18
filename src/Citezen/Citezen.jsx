import { useState } from "react"
import { useEffect } from "react"

import { useNavigate } from "react-router-dom"


const Citezen = () => {
  const navigate = useNavigate()
  const [user,setUser] = useState(null)
  const [loading,setLoading] =useState(true)

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token) {
      navigate("/")
      return
    }
    fetch("http://localhost:5000/api/me",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((res)=>{
      if(!res.ok) throw new Error("Invalid session");
      return res.json();
    })
    .then((data)=>{
      if(data.rolee !== "citizen"){
        navigate("/")
        return
      }
      setUser(data);
      setLoading(false);
    })
    .catch(()=>{
      localStorage.removeItem("token");
      navigate("/")
    })
  },[])
  if (loading) return <p>Loading...</p>
  const handleLogout = () =>{
    localStorage.removeItem("token");
    navigate("/")
  }
  return (
    <>
    <div>
      <h1>Welcome,{user.full_name}</h1>
      <p>Email:{user.email}</p>
      <p>Role:{user.rolee}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
    </>
  )
}

export default Citezen