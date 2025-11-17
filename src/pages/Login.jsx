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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
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