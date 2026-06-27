"use client";

import { useEffect, useState } from "react";

export default function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/update-role/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        alert("Role updated!");
        // ইউজার লিস্ট রিফ্রেশ করা
        window.location.reload(); 
      }
    } catch (error) {
      alert("Failed to update role");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <table className="table w-full bg-white rounded-xl shadow-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><span className="badge badge-primary">{user.role}</span></td>
              <td>
                <select 
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="select select-sm select-bordered"
                  defaultValue={user.role}
                >
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
  );
}