import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");
  const [adminExists, setAdminExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if admin already exists
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/admin-exists`);
        setAdminExists(res.data.adminExists);
        // If admin exists, force role to Member
        if (res.data.adminExists) {
          setRole("Member");
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAdminExists();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        name,
        email,
        password,
        role,
      });
      const token = res.data.token;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userRole", res.data.user.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
        .signup-input:focus, .signup-select:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        .signup-btn:active {
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
            Create Account
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#718096",
              margin: "0",
            }}
          >
            Join us and start managing tasks
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
          onSubmit={handleSignup}
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
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="signup-input"
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
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-input"
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
              className="signup-input"
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
              Account Type
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={adminExists}
              className="signup-select"
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "15px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                backgroundColor: "white",
                cursor: adminExists ? "not-allowed" : "pointer",
                opacity: adminExists ? 0.6 : 1,
              }}
            >
              <option value="Member">Member</option>
              <option value="Admin" disabled={adminExists}>
                Admin
              </option>
            </select>
            {adminExists && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#f6ad55",
                  marginTop: "6px",
                  fontWeight: "500",
                }}
              >
                ⓘ Admin account already exists. New signups are Members only.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="signup-btn"
            style={{
              padding: "12px 16px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              marginTop: "4px",
            }}
          >
            Create Account
          </button>
        </form>

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
            Already have an account?
          </p>
          <button
            onClick={() => navigate("/login")}
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
            Sign In Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
