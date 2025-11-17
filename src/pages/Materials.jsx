
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 


const MaterialCard = ({ material }) => (
  <div className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-500 flex flex-col justify-between h-full">
    <div>
      <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full mb-3 inline-block">
        {material.subject}
      </span>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{material.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>
    </div>
    
    <div className="text-sm space-y-2">
      <p className="text-gray-500">
        <span className="font-medium text-gray-700">{material.uploadedBy?.name || 'Unknown'}</span>
        <span className="ml-2 text-xs">| Uploaded: {new Date(material.createdAt).toLocaleDateString()}</span>
      </p>
      {material.fileUrl && (
        <a
          href={`http://localhost:5000/${material.fileUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download PDF
        </a>
      )}
    </div>
  </div>
);


export default function Materials() {

  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchMaterials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/materials");
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch materials. Please check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);


  if (isLoading) return <p className="text-center mt-10 text-lg text-gray-600">Loading resources...</p>;
  if (error) return <p className="text-center mt-10 text-lg text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
      
      <main className="lg:col-span-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Browse All Materials ({materials.length})
        </h1>
        
        {materials.length === 0 ? (
          <p className="p-6 bg-yellow-50 rounded-lg text-gray-600 border border-yellow-200">
            No materials found matching your filters. Try uploading one!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {materials.map((m) => (
              <MaterialCard key={m._id} material={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}