"use client";

import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/react";
import Link from "next/link";

const authClient = createAuthClient();

export default function MyBookings() {
  const { data: session } = authClient.useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const savedBookings = JSON.parse(window.localStorage.getItem("houseNest-bookings") || "[]").filter((booking) => booking.tenantId === session.user.id);
        setBookings(savedBookings);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/my-bookings/${session.user.id}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.bookings)) {
          const merged = [...savedBookings, ...data.bookings.filter((booking) => !savedBookings.some((saved) => saved._id === booking._id))];
          setBookings(merged);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [session]);

  if (loading) return <div className="p-10 text-center text-lg">Loading your bookings...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-gray-500 mb-8">Track the status of the properties you have requested to book.</p>

      {bookings.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 text-lg">You haven't requested any properties yet.</p>
          <Link href="/properties" className="btn btn-primary mt-4 text-white">Browse Properties</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-700 text-sm">
              <tr>
                <th>Property</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                        <img src={b.propertyId?.images?.[0] || "https://via.placeholder.com/150"} alt="Property" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-lg">{b.propertyId?.title || "Unknown Property"}</span>
                        <p className="text-sm text-gray-500">{b.propertyId?.location || "Unknown Location"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold text-lg">${b.propertyId?.price || 0}</td>
                  <td>
                    <span className={`badge badge-lg text-white border-none ${b.status === "Approved" ? "bg-green-500" : b.status === "Rejected" ? "bg-red-500" : "bg-yellow-500 text-gray-800"}`}>
                      {b.status || "Pending"}
                    </span>
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