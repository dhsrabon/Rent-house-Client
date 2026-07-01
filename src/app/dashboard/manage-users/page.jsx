"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 ইউজার ফেচ করার ফাংশন
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/users`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      } else {
        setUsers(data); // যদি API সরাসরি array রিটার্ন করে
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🟢 রোল আপডেট করার ফাংশন
  const handleRoleChange = async (id, newRole) => {
    const toastId = toast.loading("Updating role...");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/users/update-role/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (res.ok) {
        toast.success(`User role updated to ${newRole}!`, { id: toastId });
        fetchUsers(); // পেজ রিলোড না করে শুধু ডেটা রিফ্রেশ করা হলো
      } else {
        toast.error("Failed to update role", { id: toastId });
      }
    } catch (error) {
      toast.error("Error updating user role.", { id: toastId });
    }
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
      <h1 className="text-3xl font-bold mb-2 text-neutral">Manage Users</h1>
      <p className="text-gray-500 mb-8 font-medium">View all registered users and manage their roles.</p>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-base-200/50">
            <tr>
              <th className="text-sm font-bold">Name</th>
              <th className="text-sm font-bold">Email</th>
              <th className="text-sm font-bold">Current Role</th>
              <th className="text-sm font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-base-50 transition-colors">
                <td className="font-bold text-neutral">{user.name}</td>
                <td className="text-gray-500 font-medium">{user.email}</td>
                <td>
                  <span className={`badge border-0 font-semibold px-3 py-3 rounded-xl ${
                    user.role === 'admin' ? 'bg-error/15 text-error' : 
                    user.role === 'owner' ? 'bg-primary/15 text-primary' : 'bg-success/15 text-success'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <select 
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="select select-sm select-bordered focus:outline-primary w-full max-w-xs font-medium"
                    defaultValue={user.role}
                  >
                    <option value="tenant">Tenant</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}