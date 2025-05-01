import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import loginImage from "../assets/images.png";

import "../style.css"; // Ensure styles are handled here

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });
      login(res.data.token);
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        
      <img src={loginImage} alt="login-background" />
      <h1 className="app-title">TaskCraft</h1>
        <p className="tagline">Plan. Track. Achieve.</p>
      </div>

      <div className="login-right">
        <form onSubmit={handleSubmit}>
          <h2>LOGIN</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="auth-buttons">
            <button type="submit">SUBMIT</button>
            <button type="button" className="register-btn">Register</button> {/* Dummy */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
