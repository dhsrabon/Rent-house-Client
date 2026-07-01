"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminAllProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isViewFeedbackModalOpen, setIsViewFeedbackModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [viewingFeedbackText, setViewingFeedbackText] = useState("");

  const fetchProperties = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/properties/admin/all`);
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const updateStatus = async (id, status, feedbackData = "") => {
    const toastId = toast.loading(`Updating status to ${status}...`);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/properties/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionFeedback: feedbackData }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Property ${status} successfully!`, { id: toastId });
        setIsRejectModalOpen(false);
        setFeedback("");
        fetchProperties(); 
      } else {
        toast.error(data.message || "Something went wrong", { id: toastId });
      }
    } catch (error) {
      toast.error("Error updating property status.", { id: toastId });
    }
  };

  const handleApprove = (id) => {
    if (window.confirm("Are you sure you want to approve this property?")) {
      updateStatus(id, "Approved", ""); 
    }
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    updateStatus(selectedPropertyId, "Rejected", feedback);
  };

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-neutral">Manage All Properties</h1>
      <p className="text-gray-500 mb-8 font-medium">Review, approve or reject property listings from owners.</p>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-base-200/50">
            <tr>
              <th className="text-sm font-bold">Property Details</th>
              <th className="text-sm font-bold">Price</th>
              <th className="text-sm font-bold">Status</th>
              <th className="text-sm font-bold">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {properties.map((property) => (
              <tr key={property._id} className="hover:bg-base-50 transition-colors">
                <td>
                  <div className="flex items-center gap-4">
                    <img 
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150"} 
                      alt="Property" 
                      className="w-16 h-16 rounded-xl object-cover shadow-sm" 
                    />
                    <div>
                      <span className="font-bold text-neutral text-base block">{property.title}</span>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">📍 {property.location}</p>
                    </div>
                  </div>
                </td>
                
                <td className="font-bold text-primary">
                  ${property.price}<span className="text-xs font-normal text-gray-400">/mo</span>
                </td>
                
                <td>
                  <span className={`badge border-0 font-semibold px-3 py-3 rounded-xl ${
                    property.status === 'Approved' ? 'bg-success/15 text-success' : 
                    property.status === 'Rejected' ? 'bg-error/15 text-error' : 'bg-warning/15 text-warning-content'
                  }`}>
                    {property.status || "Pending"}
                  </span>
                </td>
                
                <td>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(property._id)} 
                      disabled={property.status === 'Approved'}
                      className="btn btn-sm btn-success text-white disabled:bg-gray-200 disabled:text-gray-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Approve
                    </button>

                    {property.status !== 'Rejected' && (
                      <button 
                        onClick={() => { setSelectedPropertyId(property._id); setIsRejectModalOpen(true); }} 
                        className="btn btn-sm btn-error btn-outline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Reject
                      </button>
                    )}

                    {property.status === 'Rejected' && (
                      <button 
                        onClick={() => { setViewingFeedbackText(property.rejectionFeedback || "No feedback provided."); setIsViewFeedbackModalOpen(true); }} 
                        className="btn btn-sm btn-info text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        Feedback
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {properties.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">No properties found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Property Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-error flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Reject Property
            </h3>
            <p className="text-gray-500 mb-6 text-sm">Please provide a clear reason to the owner explaining why this listing is being rejected.</p>
            
            <form onSubmit={handleRejectSubmit}>
              <textarea 
                className="textarea textarea-bordered w-full mb-6 h-32 focus:outline-error text-base" 
                placeholder="e.g. Images are too blurry, Price is unrealistic..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-ghost rounded-xl" onClick={() => { setIsRejectModalOpen(false); setFeedback(""); }}>Cancel</button>
                <button type="submit" className="btn btn-error text-white rounded-xl px-6 shadow-md hover:shadow-lg">Submit Rejection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Feedback Modal */}
      {isViewFeedbackModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-info flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Rejection Reason
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 my-6">
              <p className="text-gray-700 whitespace-pre-wrap">{viewingFeedbackText}</p>
            </div>
            
            <div className="flex justify-end">
              <button type="button" className="btn btn-info text-white rounded-xl px-6" onClick={() => setIsViewFeedbackModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}