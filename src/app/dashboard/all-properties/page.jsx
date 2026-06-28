"use client";

import { useEffect, useState } from "react";

export default function AdminAllProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [feedback, setFeedback] = useState("");

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/admin/all`);
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // 🔴 সংশোধিত ফাংশন: এখানে URL টি ঠিক করা হয়েছে
  const updateStatus = async (id, status, feedbackData = "") => {
    try {
     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionFeedback: feedbackData }),
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`Property ${status} successfully!`);
        setIsModalOpen(false);
        setFeedback("");
        fetchProperties();
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Error updating property status.");
    }
  };

  const handleApprove = (id) => {
    if (window.confirm("Approve this property?")) {
      updateStatus(id, "Approved");
    }
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    updateStatus(selectedPropertyId, "Rejected", feedback);
  };

  if (loading) return <div className="p-10 text-center text-lg">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Manage All Properties (Admin)</h1>
      <p className="text-gray-500 mb-8">Approve or reject property listings from owners.</p>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Property</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property._id}>
                <td>
                  <div className="flex items-center gap-4">
                    <img src={property.images?.[0] || "https://via.placeholder.com/150"} alt="Property" className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <span className="font-bold">{property.title}</span>
                      <p className="text-sm text-gray-500">{property.location}</p>
                    </div>
                  </div>
                </td>
                <td className="font-semibold">${property.price}</td>
                <td>
                  <span className={`badge text-white ${
                    property.status === 'Approved' ? 'bg-green-500' : 
                    property.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {property.status || "Pending"}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(property._id)} 
                      disabled={property.status === 'Approved'}
                      className="btn btn-sm btn-success text-white"
                    >Approve</button>
                    <button 
                      onClick={() => { setSelectedPropertyId(property._id); setIsModalOpen(true); }} 
                      disabled={property.status === 'Rejected'}
                      className="btn btn-sm btn-error text-white"
                    >Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal remain same as yours */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Reject Property</h3>
            <form onSubmit={handleRejectSubmit}>
              <textarea 
                className="textarea textarea-bordered w-full mb-4" 
                placeholder="Reason for rejection..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-error text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}