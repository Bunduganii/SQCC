import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const StaffPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/")
      return;
    }
    fetch("http://localhost:5000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid Session");
        return res.json();
      })
      .then((data) => {
        if (data.rolee !== "staff") {
          navigate("/")
          return
        }
        setUser(data)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem("token")
        navigate("/")
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>StaffPage</h1>
      <p>Welcome, {user.full_name}</p>
      <p>Role: {user.rolee}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default StaffPage