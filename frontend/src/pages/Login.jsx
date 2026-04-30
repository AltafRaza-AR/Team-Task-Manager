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

      // 3. Save the token to the browser's local storage so we stay logged in
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", response.data.user.role);

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
        maxWidth: "400px",
        margin: "50px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Log In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
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
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
