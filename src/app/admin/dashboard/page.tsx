// src/app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AdminGuard from "@/components/security/AdminGuard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminGuard>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto mt-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Welcome to Admin Dashboard
          </h1>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.users}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.orders}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  ${stats.revenue.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
