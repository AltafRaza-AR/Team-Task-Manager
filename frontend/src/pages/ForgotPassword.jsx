import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("request");
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        {
          email,
        },
      );

      setMessage(response.data.message);
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      }
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create reset token");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          email,
          token: resetToken,
          newPassword,
        },
      );

      setMessage(response.data.message);
      setResetToken("");
      setNewPassword("");
      setStep("done");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password");
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
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          padding: "40px",
          maxWidth: "460px",
          width: "100%",
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", color: "#1a202c" }}>
          Reset Password
        </h1>
        <p style={{ margin: "0 0 24px 0", color: "#718096", fontSize: "14px" }}>
          Use your email address to request a reset token, then set a new
          password.
        </p>

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

        {message && (
          <div
            style={{
              background: "#e6fffa",
              border: "1px solid #81e6d9",
              color: "#285e61",
              padding: "12px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {step === "request" && (
          <form
            onSubmit={handleRequestReset}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2d3748",
                  marginBottom: "6px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "15px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "12px 16px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Request Reset Token
            </button>
          </form>
        )}

        {step === "reset" && (
          <form
            onSubmit={handleResetPassword}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2d3748",
                  marginBottom: "6px",
                }}
              >
                Reset Token
              </label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
                placeholder="Paste the token here"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "15px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2d3748",
                  marginBottom: "6px",
                }}
              >
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: "15px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "12px 16px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Set New Password
            </button>
          </form>
        )}

        {step === "done" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <p style={{ margin: 0, color: "#2d3748", fontSize: "14px" }}>
              Your password has been updated. You can now sign in with the new
              password.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                padding: "12px 16px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Back to Login
            </button>
          </div>
        )}

        {step === "reset" && import.meta.env.DEV && resetToken && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              background: "#f7fafc",
              border: "1px dashed #cbd5e0",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#4a5568",
              wordBreak: "break-all",
            }}
          >
            Dev reset token: {resetToken}
          </div>
        )}

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#667eea",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
