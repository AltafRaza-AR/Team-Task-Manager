import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", res.data.user.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSignup}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <label>
          Role:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ marginTop: "8px", padding: "8px" }}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </label>

        <button
          type="submit"
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
