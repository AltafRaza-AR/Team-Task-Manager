import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getUserRoleFromToken } from "../utils/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Decode JWT to get userId
        const parts = token.split(".");
        const decoded = JSON.parse(atob(parts[1]));
        const userId = decoded.userId;

        // Fetch user details from backend
        const res = await axios.get(`${API_BASE_URL}/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div style={{ color: "white", fontSize: "18px" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ color: "#c53030", margin: "0 0 16px 0" }}>
            Error Loading Profile
          </h2>
          <p style={{ color: "#718096", margin: "0 0 24px 0" }}>
            {error || "User profile not found"}
          </p>
          <button
            onClick={handleBackToDashboard}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profile-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profile-header h2 {
          margin: 0;
          font-size: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .back-btn {
          padding: 10px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        .profile-content {
          max-width: 600px;
          margin: 40px auto;
          padding: 0 20px;
        }
        .profile-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.6s ease-out;
        }
        .profile-card h1 {
          font-size: 36px;
          color: #1a202c;
          margin: 0 0 8px 0;
        }
        .profile-subtitle {
          color: #718096;
          font-size: 15px;
          margin: 0 0 32px 0;
          line-height: 1.6;
        }
        .profile-section {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #e2e8f0;
        }
        .profile-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .profile-field {
          margin-bottom: 24px;
        }
        .profile-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .profile-field-value {
          font-size: 16px;
          color: #1a202c;
          padding: 12px 14px;
          background: #f7fafc;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        .profile-role {
          display: inline-block;
          padding: 8px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
        }
        .profile-role.admin {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .profile-role.member {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        }
      `}</style>

      <div className="profile-header">
        <h2>👤 My Profile</h2>
        <button className="back-btn" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <h1>{user.name}</h1>
          <p className="profile-subtitle">Manage your account information</p>

          <div className="profile-section">
            <div className="profile-field">
              <label>Full Name</label>
              <div className="profile-field-value">{user.name}</div>
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <div className="profile-field-value">{user.email}</div>
            </div>

            <div className="profile-field">
              <label>Account Role</label>
              <div>
                <span
                  className={`profile-role ${
                    user.role === "Admin" ? "admin" : "member"
                  }`}
                >
                  {user.role === "Admin" ? "👑 Admin" : "👤 Member"}
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#718096",
                  marginTop: "8px",
                  marginBottom: "0",
                }}
              >
                {user.role === "Admin"
                  ? "You have admin privileges and can manage projects and team members."
                  : "You are a team member and can contribute to projects."}
              </p>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-field">
              <label>Account Created</label>
              <div className="profile-field-value">
                {new Date(user.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleBackToDashboard}
            style={{
              width: "100%",
              padding: "12px 24px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.3s ease",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
