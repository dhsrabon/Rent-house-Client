"use client";

import { useState, useEffect } from "react";
import { createAuthClient } from "better-auth/react";

// Auth Client Initialize
const authClient = createAuthClient();

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    photoURL: "",
    role: "Tenant",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || "",
        email: session.user.email || "",
        photoURL: session.user.image || "",
        role: session.user.role || "Tenant",
        phone: session.user.phone || "",
        address: session.user.address || ""
      });
    }
  }, [session]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return alert("User not found!");
    
    setLoading(true);
    try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/update-profile/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 Profile updated successfully!");
      } else {
        alert("❌ Error: " + (data.message || "Failed to update"));
      }
    } catch (error) {
      alert("❌ Connection Error! Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <div className="text-center p-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral mb-6">My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="avatar mb-4">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name || "User"}`} 
                  alt="Profile" 
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-neutral">{user.name}</h2>
            <p className="text-gray-500 mb-2">{user.email}</p>
            <div className="badge badge-primary badge-outline uppercase font-semibold">{user.role}</div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-semibold">Full Name</span></label>
                  <input type="text" name="name" value={user.name} onChange={handleChange} className="input input-bordered focus:outline-primary" required />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-semibold">Email</span></label>
                  <input type="email" value={user.email} className="input input-bordered bg-gray-100 text-gray-500 cursor-not-allowed" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-semibold">Phone Number</span></label>
                  <input type="tel" name="phone" value={user.phone} onChange={handleChange} placeholder="+880..." className="input input-bordered focus:outline-primary" />
                </div>
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-semibold">Address</span></label>
                  <input type="text" name="address" value={user.address} onChange={handleChange} placeholder="City, Country" className="input input-bordered focus:outline-primary" />
                </div>
              </div>
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-semibold">Profile Photo URL</span></label>
                <input type="url" name="photoURL" value={user.photoURL} onChange={handleChange} className="input input-bordered focus:outline-primary" />
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" className="btn btn-primary text-white px-8" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}