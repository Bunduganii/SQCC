import { useState } from "react";
import { MdVerifiedUser, MdLogin, MdAlternateEmail, MdLock,MdVisibility, MdVisibilityOff, MdAccountBalance,MdLocalShipping, 
  MdPerson, MdVerified} from "react-icons/md";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import "../Auth/Login.css";
import { useNavigate } from "react-router-dom";

const USER_TYPES = [
  { key: "gov",      label: "Official",  icon: <MdAccountBalance />, idLabel: "Government ID / Email",              placeholder: "ID-2024-XXXX" },
  { key: "importer", label: "Importer",  icon: <MdLocalShipping />,  idLabel: "Importer Registration No. / Email",  placeholder: "REG-XXXX-2024" },
  { key: "public",   label: "Citizen",   icon: <MdPerson />,         idLabel: "Email Address",                      placeholder: "you@example.com" },
];

const Login = () => {
  const [activeType, setActiveType] = useState("gov");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loginData, setLoginData] = useState({
  identifier: "",
  password: ""
})
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)
const navigate = useNavigate()

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginData.identifier,
        password: loginData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || data.errors || "Login Failed");
      return;
    }

    localStorage.setItem("token", data.token);

    // Redirect based on role
    if (data.user.rolee === "staff") {
      navigate("/Staff-dash");
    } else {
      window.location.href = "/Citezens";
    }

  } catch (err) {
    console.error(err);
    setError("Server ka Lagaadhi Kari wayey. Ku celi Mar Kale");
  } finally {
    setLoading(false);
  }
};

// error in catch
//  const handleLogin = async (e)=>{
//   e.preventDefault();
//     setLoading(true);
//   setError("");
//   try{
//      const res = await fetch("http://localhost:5000/api/login",{
//     method:"post",
//     headers:{"Content-Type":"application/json"},
//     body:JSON.stringify({email,password})
//   })
//   const data = await res.json();
//   if(res.ok){
//     localStorage.setItem("token",data.token);
//     setError(data.errors || "Login Failed")
//     // redirect based on role
//     if(data.user.rolee === "staff") navigate("/Staff-dash")
//     else window.location.href="/Citezens"
//   }catch(err){
//     setError("Server ka Lagaadhi Kari wayey.Ku celi Mar Kale")
//   } finally{
//     setLoading(false)
//   }

//   }
 
//  }

  const current = USER_TYPES.find(t => t.key === activeType);
  const isPublic = activeType === "public";

  return (
    <div className="sqcc-root">

      {/* Header */}
      <header className="sqcc-header">
        <div className="sqcc-logo"><MdVerifiedUser /></div>
        <h1 className="sqcc-brand-title">SQCC Quality Control</h1>
        <p className="sqcc-brand-sub">
          Secure Government Access Portal for Quality Standards and Regulatory Oversight in Somaliland.
        </p>
      </header>

      {/* Card */}
      <main className="sqcc-card">

        {/* Left Panel */}
        <div className="sqcc-left">
          <div className="sqcc-left-bg" />
          <div className="sqcc-left-overlay" />
          <div className="sqcc-left-content">
            <span className="sqcc-badge">SECURE PORTAL</span>
            <h2 className="sqcc-left-title">Safeguarding Excellence Across Borders</h2>
            <p className="sqcc-left-desc">
              The Somaliland Quality Control Commission ensures all goods and services meet the highest
              international standards of safety and excellence.
            </p>
            <div className="sqcc-left-footer">
              <div className="sqcc-avatars">
                <div className="sqcc-avatar">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgruFNS8ETmxR8A_KIQ2xZf56B4NZqwn_tK9Q_p8B5prhLF6d1jmSblR0OVKgYGLqfO2Ub_9knOL6h9s6Mlf450xPYrOkCJao7t3xmn9CKjSugBksvoqeHOQSJm-XdEu58I0NQQ7FW57IEUUDMbIKGCACs2BoPDcdvE47Gh2Bw58oL4lNk7eIEv17qWZ3HyKejL9qxvwaAIq0PKYVljO8J9tbdpeXQGnluuKe5DnNGi1hVMSW5iI4xmMtVi80A82wRByKshv3LkCM"
                    alt="Official"
                  />
                </div>
                <div className="sqcc-avatar">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0QfKRpSr5jqK-F6zRclHjkOHZOZgieEbPjzf6zu5g3_ZYCfiMUcixS_Q0WbodD6-Dt2eb0cGv6VDjPDuNOM_CHuU6vA6XOtZZ1BmA5u8HmNS6uqNXUdOrPmVGbrkVFct3QmRS-3XGAlzReHBvVEmCZpXL7YExxfNZAY9Ex2jmjuihRbTQzQIi72_BlzVN8bne_mkbLYI8aXN5RK8dFndnCucTSbXaRn_Z9mrgyIZBKoQpq7E3kwitFWg"
                    alt="Importer"
                  />
                </div>
              </div>
              <span className="sqcc-left-stat">Joined by 10,000+ certified entities</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="sqcc-right">
          <p className="sqcc-form-title">Welcome Back</p>
          <p className="sqcc-form-sub">Please select your account type to proceed</p>

          {/* Type Selector */}
          <div className="sqcc-type-grid">
            {USER_TYPES.map(t => (
              <button
                key={t.key}
                className={`sqcc-type-btn${activeType === t.key ? " active" : ""}`}
                onClick={() => setActiveType(t.key)}
                type="button"
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* ID Field */}
          <div className="sqcc-field">
            <div className="sqcc-field-header">
              <label className="sqcc-label">{current.idLabel}</label>
            </div>
            <div className="sqcc-input-wrap">
              <span className="sqcc-input-icon"><MdAlternateEmail /></span>
              <input className="sqcc-input" type="text" placeholder={current.placeholder} value={loginData.identifier}
               onChange={(e)=>setLoginData({...loginData,identifier:e.target.value})}/>
            </div>
          </div>

          {/* Password Field */}
          <div className="sqcc-field">
            <div className="sqcc-field-header">
              <label className="sqcc-label">Secure Password</label>
              <a href="#" className="sqcc-forgot">Forgot Password?</a>
            </div>
            <div className="sqcc-input-wrap">
              <span className="sqcc-input-icon"><MdLock /></span>
              <input
                className="sqcc-input sqcc-input-pw"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                  value={loginData.identifier}
               onChange={(e)=>setLoginData({...loginData,identifier:e.target.value})}/>
              <button
                className="sqcc-eye-btn"
                type="button"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          {/* Remember */}
          <div className="sqcc-check-row">
            <input
              className="sqcc-checkbox"
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <label className="sqcc-check-label" htmlFor="remember">Remember this workstation</label>
          </div>

           {/* error massege */}
           {error && <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
          {/* Submit */}
          <button className="sqcc-submit" type="button" onClick={handleLogin} disabled={loading}>
             {loading ? "Logging in...":"Secure Login"}
            <MdLogin />
          </button>

          {/* Social Login — citizens only */}
          {isPublic && (
            <div className="sqcc-social">
              <div className="sqcc-divider">
                <div className="sqcc-divider-label"><span>OR CONTINUE WITH</span></div>
              </div>
              <div className="sqcc-social-grid">
                <button className="sqcc-social-btn" type="button">
                  <FaGoogle className="icon-google" />
                  Google
                </button>
                <button className="sqcc-social-btn" type="button">
                  <FaFacebook className="icon-facebook" />
                  Facebook
                </button>
              </div>
            </div>
          )}

          <p className="sqcc-register">
            Need an account? <a href="#">Apply for Certification</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="sqcc-footer">
        <div className="sqcc-footer-brand">
          <MdVerified className="icon-verified" />
          <span>© 2024 Somaliland Quality Control Commission. All Rights Reserved.</span>
        </div>
        <div className="sqcc-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Security Standards</a>
          <a href="#">Contact Support</a>
        </div>
      </footer>

    </div>
  );
};

export default Login;





































// import { MdVerifiedUser } from "react-icons/md";


// const Login = () => {
//   return (
//    <>
//    <div className="sqcc-root">
//     {/* Header */}
//     <header className="sqcc-header">
//     <div className="sqcc-logo"> <MdVerifiedUser /></div>
//     <h1 className="sqcc-title">SQCC Hay'adda Dhawrista Tayda JSL,</h1>
//     </header>
//    </div>
//    </>
//   )
// }

// export default Login




















// Style Error
// import '../Auth/Login.css'
// const Login = () => {
//   return (
//     <>
//     <div className='login-page'>
//       {/* Header */}
//       <header className='top-bar'>
//       <div className='logo-section'>
//       <span className='shield'>🚨</span>
//       <h2>Auth</h2>
//       </div>
//       <div className='top-links'>
//        <span>🌐Language</span>
//        <span>❓Help</span>
//       </div>
//       </header>
//       {/* Background */}
//       <div className='login-background'></div>
//       {/* Login card */}
//       <div className='card-container'>
//      <div className='auth-card'>
//         <div className='icon-circle'>
//         🔒
//         </div>
//         <h1>Staff Authentication</h1>
//         <p className='subtitle'>Access The National Quality Control Gateway</p>
//         <div className='input-group'>
//         <label>Username or Email</label>
//         <input type='text' placeholder='enter creadetial'/>
//         </div>
//         <div className='input-group'>
//             <div className='password-row'>
//               <label>Password</label>
//         <span className='Forgot-password'>Forgot Password</span>
//         <input type='password' placeholder='enter creadetial'/>
//         </div>
//         </div>
//         <button className='sign-in'>
//             Sign In
//         </button>
//         <div className='divider'>
//        <span>Or</span>
//         </div>
//         <button>Sig In With Goverment SSO</button>
//         <div className='notice-box'>
//          this system Is Monitered.
//          Unauthorized Access Is Prohibited.
//          All Activities May Be Logged For Security Auditing
//         </div>
//      </div>
//       </div>
//       {/* Footer */}
//       <footer>
//         <div>SQCC Secure system</div>
//         <div>
//             2026 Somaliland Quality Control Commission
//         </div>
//       </footer>
//     </div>
//     </>
//   )
// }

// export default Login