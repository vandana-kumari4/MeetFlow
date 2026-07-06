import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Authentication.css";

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    try {
      if (isRegister) {
        let result = await handleRegister(name, username, password);
        if (result === "User Registered") {
          setIsRegister(false);
          setError("Account created! Please sign in.");
        }
      } else {
        await handleLogin(username, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  // ✅ Google Login function
  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Token aur user info localStorage mein save karo
      localStorage.setItem("token", user.accessToken || "google-auth-token");
      localStorage.setItem("userName", user.displayName);
      localStorage.setItem("userEmail", user.email);

      navigate("/home");
    } catch (err) {
      console.log("Google login error:", err);
      setError("Google sign-in failed. Try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
          </div>
          <span>MeetFlow</span>
        </div>

        <div className="auth-tagline">
        <h2>
  Connect.
  <br />
  Collaborate.
  <br />
  Communicate.
</h2>

<p>
  Secure HD video meetings for teams, interviews,
  online classes and remote collaboration.
</p>
        </div>

        <div className="auth-stats">
          <div className="stat">
            <span className="stat-num">10K+</span>
            <span className="stat-label">Meetings daily</span>
          </div>
          <div className="stat">
            <span className="stat-num">HD</span>
            <span className="stat-label">Video quality</span>
          </div>
          <div className="stat">
            <span className="stat-num">100%</span>
            <span className="stat-label">Always</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-title">
            {isRegister ? "Create Your Account" : "Welcome Back 👋"}
          </h1>
         <p className="auth-sub">
  {isRegister
    ? "Create your account and start collaborating instantly."
    : "Sign in to continue your meetings securely."}
</p>

          {error && (
            <div className={`auth-msg ${error.includes("created") ? "success" : "error"}`}>
              {error}
            </div>
          )}

          {/* ✅ Google Sign-in button */}
          <button
            onClick={handleGoogleLogin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              padding: "12px",
              background: "#ffffff",
              border: "1.5px solid #e0e0ef",
              borderRadius: "9px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#1a1a2e",
              cursor: "pointer",
              marginBottom: "1.5rem"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "#e0e0ef" }}></div>
            <span style={{ fontSize: "12px", color: "#aaa" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "#e0e0ef" }}></div>
          </div>

          <div className="auth-form">
            {isRegister && (
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Vandana Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="vandana123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <button className="auth-submit-btn" onClick={handleSubmit}>
              {isRegister ? "Create Account" : "Sign In"}
            </button>
          </div>

                <p className="auth-toggle">
            {isRegister ? "Already have an account? " : "New to MeetFlow? "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
            >
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}