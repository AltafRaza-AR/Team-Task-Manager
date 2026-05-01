import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setError("");

    try {
      // 1. Send the data to our backend!
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      // 2. Grab the token from the response
      const token = response.data.token;

      // 3. Save the token to the browser's session storage so we stay logged in
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userRole", response.data.user.role);

      // 4. Redirect the user to the Dashboard
      navigate("/dashboard");
    } catch (err) {
      // If the backend sends back an error (like wrong password), show it!
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-input:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        .login-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          padding: "48px 40px",
          maxWidth: "420px",
          width: "100%",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1a202c",
              margin: "0 0 8px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#718096",
              margin: "0",
            }}
          >
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fed7d7",
              border: "1px solid #fc8181",
              color: "#c53030",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#2d3748",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "15px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#2d3748",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "15px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            style={{
              padding: "12px 16px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              backgroundColor:
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              marginTop: "4px",
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: "12px", textAlign: "right" }}>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              padding: "0",
            }}
          >
            Forgot password?
          </button>
        </div>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "24px",
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
          }}
        >
          <p
            style={{ fontSize: "14px", color: "#4a5568", margin: "0 0 8px 0" }}
          >
            Don't have an account?
          </p>
          <button
            onClick={() => navigate("/signup")}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#764ba2")}
            onMouseLeave={(e) => (e.target.style.color = "#667eea")}
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
