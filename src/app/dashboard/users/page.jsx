"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/users`);
      const data = await res.json();
      setUsers(data.users || data || []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    const toastId = toast.loading("Updating role...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/users/update-role/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success(`User role updated to ${newRole}!`, { id: toastId });
        fetchUsers();
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
      <p className="text-gray-500 mb-8">View all registered users and manage their roles.</p>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === "admin" ? "badge-error" : user.role === "owner" ? "badge-primary" : "badge-success"}`}>{user.role}</span>
                </td>
                <td>
                  <select onChange={(e) => handleRoleChange(user._id, e.target.value)} className="select select-sm select-bordered" defaultValue={user.role}>
                    <option value="tenant">Tenant</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}