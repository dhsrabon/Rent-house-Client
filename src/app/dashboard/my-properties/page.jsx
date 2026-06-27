"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function MyPropertiesPage() {
  const { data: session } = authClient.useSession();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাটা লোড করার ফাংশন
  const fetchProperties = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/properties/my/${session.user.id}`);
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
  }, [session]);

  // প্রপার্টি ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (confirmDelete) {
      try {
        const res = await fetch(`http://localhost:5000/api/properties/delete/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        
        if (data.success) {
          alert("Property deleted successfully!");
          // UI আপডেট করা
          setProperties(properties.filter(property => property._id !== id));
        }
      } catch (error) {
        alert("Failed to delete property.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">My Properties</h1>
          <p className="text-gray-500">Manage all your listed properties here.</p>
        </div>
        <Link href="/dashboard/add-property" className="btn btn-primary text-white">
          ➕ Add New Property
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading your properties...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200 text-base-content text-sm">
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Monthly Rent</th>
                  <th>Status</th>
                  <th>Added On</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      You haven't added any properties yet.
                    </td>
                  </tr>
                ) : (
                  properties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50 transition-colors">
                      <td>
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-16 h-16 rounded-xl">
                              <img src={property.images?.[0] || "https://via.placeholder.com/150"} alt={property.title} />
                            </div>
                          </div>
                          <div className="font-bold text-neutral">{property.title}</div>
                        </div>
                      </td>
                      <td><span className="badge badge-ghost font-medium">{property.type}</span></td>
                      <td className="font-semibold text-primary">${property.price}</td>
                      <td>
                        <span className={`badge badge-sm text-white ${property.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="text-gray-500 text-sm">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleDelete(property._id)} className="btn btn-sm btn-square btn-ghost text-red-500 hover:bg-red-100" title="Delete">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}