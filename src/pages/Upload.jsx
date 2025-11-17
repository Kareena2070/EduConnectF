import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Computer Science"); // Set a default subject
  const [description, setDescription] = useState("");
  
  // State for Resource Type selection: 'file' or 'link'
  const [resourceType, setResourceType] = useState("file"); 
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const token = localStorage.getItem("token");

  // --- Auto-clear message logic ---
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  // --- Subject Options (for a cleaner dropdown) ---
  const subjectOptions = [
    "Computer Science", "Mathematics", "Physics", "Chemistry", 
    "History", "Literature", "Web Development", "Database Systems"
  ];
  
  // --- Form Submission Logic (Modified to handle both file and link) ---
  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setIsLoading(true);

    if (!token) {
        navigate("/"); // Redirect to login if no token
        return;
    }
    
    // Basic validation
    if (!title.trim() || !subject.trim()) {
      setMessage("Title and Subject are required.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    if (resourceType === 'file' && !file) {
        setMessage("Please select a file to upload.");
        setMessageType("error");
        setIsLoading(false);
        return;
    }

    if (resourceType === 'link' && !url.trim()) {
        setMessage("Please enter a valid URL.");
        setMessageType("error");
        setIsLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    
    // Append file OR url based on resourceType
    if (resourceType === 'file') {
        formData.append("file", file);
    } else {
        formData.append("url", url);
    }
    // NOTE: Your backend API needs to be updated to handle the 'url' field if resourceType is 'link'

    try {
      const res = await fetch("http://localhost:5000/api/materials", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await res.json();

      if (res.ok) {
        setMessage("Resource uploaded successfully! Redirecting...");
        setMessageType("success");
        // Clear form and redirect
        setTitle("");
        setSubject(subjectOptions[0]);
        setDescription("");
        setFile(null);
        setUrl("");
        setResourceType("file");
        
        setTimeout(() => navigate("/materials"), 1500);
        
      } else {
        setMessage(data.message || "Upload failed. Please check the form and try again.");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed due to network/server error.");
      setMessageType("error");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3 text-blue-600">⚡</span> Upload a New Resource
      </h1>
      <p className="text-gray-600 mb-6">
        Share your study materials with the community.
      </p>

      {/* Notification Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-white font-medium ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          } transition duration-300`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleUpload} className="flex flex-col gap-5">
        
        {/* Title Input */}
        <label className="block">
          <span className="text-gray-700 font-medium">Title *</span>
          <input
            type="text"
            placeholder="e.g., Intro to MERN Stack Handout"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </label>
        
        {/* Subject Dropdown */}
        <label className="block">
          <span className="text-gray-700 font-medium">Subject *</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full border border-gray-300 p-3 rounded-lg bg-white focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {subjectOptions.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </label>

        {/* Description Textarea */}
        <label className="block">
          <span className="text-gray-700 font-medium">Description</span>
          <textarea
            placeholder="A detailed summary of the resource content..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
        
        {/* --- Resource Type Selector (Radio Buttons/Segmented Control) --- */}
        <div>
          <span className="text-gray-700 font-medium block mb-2">Resource Type *</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setResourceType('file')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                resourceType === 'file' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              File Upload (PDF/DOC)
            </button>
            <button
              type="button"
              onClick={() => setResourceType('link')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                resourceType === 'link' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              External Link (URL)
            </button>
          </div>
        </div>

        {/* --- Conditional Input Field --- */}
        {resourceType === 'file' ? (
          <label className="block">
            <span className="text-gray-700 font-medium">File Input (Max 5MB) *</span>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1 block w-full border border-gray-300 p-3 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required={resourceType === 'file'}
            />
          </label>
        ) : (
          <label className="block">
            <span className="text-gray-700 font-medium">URL Input *</span>
            <input
              type="url"
              placeholder="https://example.com/useful-article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              required={resourceType === 'link'}
            />
          </label>
        )}

        {/* Submit Button */}
        <button 
            type="submit" 
            className={`bg-blue-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-150 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Uploading...
            </span>
          ) : (
            "Finalize Upload"
          )}
        </button>
      </form>
    </div>
  );
}