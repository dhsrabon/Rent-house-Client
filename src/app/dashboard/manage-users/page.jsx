"use client";

import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function OwnerRequests() {
  const { data: session } = authClient.useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!session?.user?.id) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/owner-requests/${session.user.id}`);
    const data = await res.json();
    if (data.success) setRequests(data.bookings);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [session]);

  const updateStatus = async (id, status) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/update-status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      alert("Status Updated!");
      fetchRequests(); // ডাটা রিফ্রেশ করা
    }
  };

  if (loading) return <p className="p-10">Loading requests...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Requests for My Properties</h1>
      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Property</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id}>
                <td>{r.propertyId?.title}</td>
                <td><span className={`badge ${r.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
                <td className="flex gap-2">
                  <button onClick={() => updateStatus(r._id, 'Approved')} className="btn btn-success btn-sm">Accept</button>
                  <button onClick={() => updateStatus(r._id, 'Rejected')} className="btn btn-error btn-sm">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}