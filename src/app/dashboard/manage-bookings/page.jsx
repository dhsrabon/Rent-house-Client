"use client";

import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/react";
import Link from "next/link";

const authClient = createAuthClient();

export default function ManageBookings() {
  const { data: session } = authClient.useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // রিকোয়েস্টগুলো ফেচ করার ফাংশন
  const fetchRequests = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/owner-requests/${session.user.id}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [session]);

  // স্ট্যাটাস আপডেট (Accept/Reject) করার ফাংশন
  const handleStatusUpdate = async (id, newStatus) => {
    // কনফার্মেশন অ্যালার্ট
    const confirmAction = window.confirm(`Are you sure you want to ${newStatus} this booking?`);
    if (!confirmAction) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/update-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`✅ Booking successfully ${newStatus}!`);
        fetchRequests(); // ডাটা রিফ্রেশ করা যাতে আপডেট সাথে সাথে দেখা যায়
      } else {
        alert("❌ Failed to update status.");
      }
    } catch (error) {
      alert("❌ Error updating status.");
    }
  };

  if (loading) return <div className="p-10 text-center text-lg">Loading requests...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Manage Booking Requests</h1>
      <p className="text-gray-500 mb-8">Accept or reject booking requests for your properties.</p>

      {requests.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 text-lg">No booking requests found for your properties yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
          <table className="table w-full">
            {/* head */}
            <thead className="bg-gray-50 text-gray-700 text-sm">
              <tr>
                <th>Property Details</th>
                <th>Price</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                        <img 
                          src={request.propertyId?.images?.[0] || "https://via.placeholder.com/150"} 
                          alt="Property" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/properties/${request.propertyId?._id}`} className="font-bold text-lg hover:text-primary transition-colors">
                          {request.propertyId?.title || "Unknown Property"}
                        </Link>
                        <p className="text-sm text-gray-500">{request.propertyId?.location || "Unknown Location"}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="font-semibold text-lg">
                    ${request.propertyId?.price || 0}
                  </td>
                  
                  <td>
                    <span className={`badge badge-lg text-white border-none ${
                      request.status === 'Approved' ? 'bg-green-500' : 
                      request.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500 text-gray-800'
                    }`}>
                      {request.status || "Pending"}
                    </span>
                  </td>
                  
                  <td>
                    {/* যদি স্ট্যাটাস Pending থাকে, তবেই বাটন দেখাবে */}
                    {request.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(request._id, 'Approved')} 
                          className="btn btn-sm btn-success text-white"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(request._id, 'Rejected')} 
                          className="btn btn-sm btn-error text-white"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">Action Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}