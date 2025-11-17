import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// --- Helper Components (No Change) ---

const StatCard = ({ count, title, icon }) => (
  <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{count}</p>
    </div>
    <div className="text-blue-500 text-2xl">{icon}</div>
  </div>
);

const ActionButton = ({ icon, text, to, className = "" }) => (
  <Link 
    to={to} 
    className={`flex items-center justify-center p-4 rounded-lg text-lg font-semibold transition duration-150 ease-in-out ${className}`}
  >
    <span className="mr-2 text-xl">{icon}</span>
    {text}
  </Link>
);

// --- Main Dashboard Component ---

// 1. Removed unused onLoginSuccess prop
export default function Dashboard() {
  const navigate = useNavigate();
  // Initialize user as null to correctly trigger loading state
  const [user, setUser] = useState(null); 
  const [stats, setStats] = useState({ total: 5432, uploads: 12, new: 45 }); // Mock stats

  // 🎯 RE-INTEGRATED DATA FETCHING LOGIC
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // CRITICAL FIX: If token is missing (e.g., cleared by logout), 
    // set state to null and redirect immediately, preventing old data flash.
    if (!token) {
      setUser(null);
      navigate("/"); 
      return;
    }

    const fetchUser = async () => {
      try {
        const rawBase = import.meta.env.VITE_API_URL || "";
        const url = rawBase ? new URL("/api/users/me", rawBase).toString() : "/api/users/me";

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          // Invalid token or error → redirect to login
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setUser(data.user); // This sets the real user data!
        }
      } catch (err) {
        // Handle network error
        console.error("User fetch error:", err);
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]); 

  // 2. Removed the redundant local handleLogout function. 
  // App.jsx now handles the clear/redirect correctly via the Navbar.
  
  // If user is null (still fetching or authentication failed)
  if (!user) return <p className="text-center mt-10 text-xl font-medium text-blue-600">Loading user data...</p>;

  // --- Start of UI/Render ---
  return (
    <div className="space-y-8 flex jusstify-center align-center flex-col mt-[10%]">
      {/* 2.1. Welcome & Stats Widget (Full Width Banner) */}
      <div className="bg-blue-500 p-6 sm:p-8 rounded-xl text-white shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          👋 Hello, {user.name}!
        </h1>
        <p className="text-blue-100 mb-6 text-lg">
          What would you like to learn today?
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard count={stats.total} title="Total Resources" icon="📄" />
          <StatCard count={stats.uploads} title="Your Uploads" icon="⬆️" />
          <StatCard count={stats.new} title="New This Week" icon="✨" />
        </div>
      </div>
      
      {/* 2.2. Key Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionButton 
          to="/upload" 
          text="Upload a New Resource" 
          icon="⚡" 
          className="bg-green-500 text-white hover:bg-green-600"
        />
        <ActionButton 
          to="/materials" 
          text="Browse All Subjects" 
          icon="🔍" 
          className="bg-yellow-500 text-white hover:bg-yellow-600"
        />
      </div>
    </div>
  );
}