import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🎯 1. Receive the onLoginSuccess prop
export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Build the request URL with the URL() constructor so it's safe even if the
      // VITE_API_URL has or lacks a trailing slash (prevents double-slash redirects)
      const rawBase = import.meta.env.VITE_API_URL || "";
      let url;
      if (rawBase) {
        // ensure rawBase is an absolute URL
        url = new URL("/api/users/login", rawBase).toString();
      } else {
        // relative to current origin
        url = "/api/users/login";
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token); // store JWT token
        
        // 🎯 2. Call the callback function to update App.jsx state instantly
        if (onLoginSuccess) {
            onLoginSuccess();
        }

        navigate("/dashboard"); // redirect to Dashboard
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl mb-4">Login</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-2 py-1 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-2 py-1 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}