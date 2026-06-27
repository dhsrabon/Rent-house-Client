"use client";

import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const authClient = createAuthClient();

export default function DashboardHome() {
  const { data: session } = authClient.useSession();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`http://localhost:5000/api/bookings/analytics/${session.user.id}`)
        .then(res => res.json())
        .then(data => setAnalytics(data));
    }
  }, [session]);

  if (!analytics) return <div>Loading Analytics...</div>;

  const { stats, chartData } = analytics;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Earnings</p>
          <h2 className="text-3xl font-bold text-primary">${stats.totalEarnings}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Properties</p>
          <h2 className="text-3xl font-bold text-primary">{stats.totalProperties}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Total Bookings</p>
          <h2 className="text-3xl font-bold text-primary">{stats.totalBookings}</h2>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6">Monthly Earnings (Last 12 Months)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}