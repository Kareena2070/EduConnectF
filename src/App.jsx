// App.jsx (CORRECTED with useNavigate and redirect on logout)
import { Routes, Route, Link, useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { useState, useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import Upload from "./pages/Upload";

// --- Component: Header/Navigation Bar (No Change Needed) ---
function MainHeader({ isLoggedIn, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Main Links */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 text-2xl font-bold text-blue-600">
              <span className="mr-1">📚</span> EduConnect
            </Link>
            
            {isLoggedIn && (
              <div className="hidden md:ml-10 md:flex md:space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Link to="/materials" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Browse Materials</Link>
                <Link to="/upload" className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Upload New</Link>
              </div>
            )}
          </div>

          {/* User Profile (Logged In) */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <>
                {/* User Profile / Logout Button (Simplified for this file) */}
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full text-white bg-red-500 hover:bg-red-600 text-sm font-medium"
                  aria-label="User Profile"
                >
                  Logout
                </button>
              </>
            )}

            {/* Login/Register Links (Logged Out) */}
            {!isLoggedIn && (
              <>
                 <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                 <Link to="/register" className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  // 2. Initialize useNavigate
  const navigate = useNavigate(); 
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  
  // Function to update the state after successful login (called from Login.jsx)
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  
  // Custom hook or function to handle storage change (good for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // 3. 🎯 CRITICAL FIX: Redirect to the login page immediately
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use the new Header component */}
      <MainHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          {/* 🎯 FIX: Pass onLoginSuccess to the Login component */}
          <Route 
            path="/" 
            element={<Login onLoginSuccess={handleLoginSuccess} />} 
          />
          <Route path="/register" element={<Register />} />
          
          {/* FIX: Remove the redundant onLoginSuccess prop from Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </div>
  );
}