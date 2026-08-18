
import { useState } from "react";
import {MdVerifiedUser,MdPerson,MdAlternateEmail,MdLock,
  MdVisibility,MdVisibilityOff,MdHowToReg,MdVerified,MdBadge,} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerData, setRegisterData] = useState({
    full_name: "",
    email: "",
    goverment_id: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!registerData.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!registerData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (registerData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (registerData.password !== registerData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: registerData.full_name,
          email: registerData.email,
          goverment_id: registerData.goverment_id,
          password: registerData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(
        "Server-ka lama xiriirin karo. Fadlan isku day mar kale."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sqcc-root">

      {/* Header */}
      <header className="sqcc-header">
        <div className="sqcc-logo">
          <MdVerifiedUser />
        </div>

        <h1 className="sqcc-brand-title">
          SQCC Quality Control
        </h1>

        <p className="sqcc-brand-sub">
          Secure Government Access Portal for Quality Standards
          and Regulatory Oversight in Somaliland.
        </p>
      </header>


      {/* Register Card */}
      <main className="sqcc-card">

        {/* Left Side */}
        <div className="sqcc-left">

          <div className="sqcc-left-bg"></div>

          <div className="sqcc-left-overlay"></div>

          <div className="sqcc-left-content">

            <span className="sqcc-badge">
              SECURE REGISTRATION
            </span>

            <h2 className="sqcc-left-title">
              Join the SQCC Digital Portal
            </h2>

            <p className="sqcc-left-desc">
              Create your account to access quality control,
              certification, regulatory and public services
              through a secure digital platform.
            </p>

            <div className="sqcc-left-footer">

              <div className="sqcc-avatars">

                <div className="sqcc-avatar">
                  <MdVerifiedUser />
                </div>

                <div className="sqcc-avatar">
                  <MdPerson />
                </div>

              </div>

              <span className="sqcc-left-stat">
                Secure access for registered users
              </span>

            </div>

          </div>
        </div>


        {/* Right Side */}
        <div className="sqcc-right">

          <p className="sqcc-form-title">
            Create Your Account
          </p>

          <p className="sqcc-form-sub">
            Register to access SQCC services
          </p>


          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <div className="sqcc-field">

              <div className="sqcc-field-header">
                <label className="sqcc-label">
                  Full Name
                </label>
              </div>

              <div className="sqcc-input-wrap">

                <span className="sqcc-input-icon">
                  <MdPerson />
                </span>

                <input
                  className="sqcc-input"
                  type="text"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={registerData.full_name}
                  onChange={handleChange}
                  autoComplete="name"
                />

              </div>
            </div>


            {/* Email */}
            <div className="sqcc-field">

              <div className="sqcc-field-header">
                <label className="sqcc-label">
                  Email Address
                </label>
              </div>

              <div className="sqcc-input-wrap">

                <span className="sqcc-input-icon">
                  <MdAlternateEmail />
                </span>

                <input
                  className="sqcc-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={registerData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

              </div>
            </div>


            {/* Government ID */}
            <div className="sqcc-field">

              <div className="sqcc-field-header">

                <label className="sqcc-label">
                  National ID Card
                  <span className="optional-text">
                    {" "} (Optional)
                  </span>
                </label>

              </div>

              <div className="sqcc-input-wrap">

                <span className="sqcc-input-icon">
                  <MdBadge />
                </span>

                <input
                  className="sqcc-input"
                  type="text"
                  name="government_id"
                  placeholder="Enter your National ID Card"
                  value={registerData.government_id}
                  onChange={handleChange}
                />

              </div>
            </div>


            {/* Password */}
            <div className="sqcc-field">

              <div className="sqcc-field-header">

                <label className="sqcc-label">
                  Password
                </label>

              </div>

              <div className="sqcc-input-wrap">

                <span className="sqcc-input-icon">
                  <MdLock />
                </span>

                <input
                  className="sqcc-input sqcc-input-pw"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={registerData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  className="sqcc-eye-btn"
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                >
                  {showPassword ? (
                    <MdVisibilityOff />
                  ) : (
                    <MdVisibility />
                  )}
                </button>

              </div>
            </div>


            {/* Confirm Password */}
            <div className="sqcc-field">

              <div className="sqcc-field-header">

                <label className="sqcc-label">
                  Confirm Password
                </label>

              </div>

              <div className="sqcc-input-wrap">

                <span className="sqcc-input-icon">
                  <MdLock />
                </span>

                <input
                  className="sqcc-input sqcc-input-pw"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirm_password"
                  placeholder="Repeat your password"
                  value={registerData.confirm_password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  className="sqcc-eye-btn"
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                >
                  {showConfirmPassword ? (
                    <MdVisibilityOff />
                  ) : (
                    <MdVisibility />
                  )}
                </button>

              </div>
            </div>


            {/* Terms */}
            <div className="sqcc-check-row">

              <input
                className="sqcc-checkbox"
                type="checkbox"
                id="terms"
                required
              />

              <label
                className="sqcc-check-label"
                htmlFor="terms"
              >
                I agree to the SQCC terms and security policy
              </label>

            </div>


            {/* Error */}
            {error && (
              <p className="register-error">
                {error}
              </p>
            )}


            {/* Success */}
            {success && (
              <p className="register-success">
                {success}
              </p>
            )}


            {/* Submit */}
            <button
              className="sqcc-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              <MdHowToReg />
            </button>

          </form>


          {/* Login */}
          <p className="sqcc-register">

            Already have an account?{" "}

            <button
              type="button"
              className="register-login-link"
              onClick={() => navigate("/login")}
            >
              Secure Login
            </button>

          </p>

        </div>

      </main>


      {/* Footer */}
      <footer className="sqcc-footer">

        <div className="sqcc-footer-brand">

          <MdVerified className="icon-verified" />

          <span>
            © 2026 Somaliland Quality Control Commission.
            All Rights Reserved.
          </span>

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

export default Register;

