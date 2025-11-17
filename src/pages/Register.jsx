import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // 1. New state for success
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Clear previous messages

    try {
      // NOTE: Ensure VITE_API_URL is correctly defined in your .env file (e.g., http://localhost:5000)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle error (e.g., "User already exists")
        setError(data.message || "Registration failed");
      } else {
        // SUCCESS HANDLING:
        setSuccessMessage(data.message); // 2. Set the success message from the backend
        
        // 3. Delay the redirect to allow the user to read the message
        setTimeout(() => {
          navigate("/"); 
        }, 1500); // Redirect after 1.5 seconds
        
        // Optional: Clear form fields
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl mb-4">Register</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        {/* Input fields */}
        {/* ... (name, email, password inputs remain here) ... */}
        
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 rounded"
          required
        />
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
          Register
        </button>
        
        {/* Display Success or Error messages */}
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-600 font-bold">{successMessage}</p>} {/* 4. Display success message */}
      </form>
    </div>
  );
}