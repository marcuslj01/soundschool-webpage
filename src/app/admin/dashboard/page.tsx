// src/app/admin/dashboard/page.tsx
"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import AdminGuard from "@/components/security/AdminGuard";

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto mt-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Welcome to Admin Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Users</h3>
              <p className="text-3xl font-bold text-indigo-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
              <p className="text-3xl font-bold text-indigo-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Products</h3>
              <p className="text-3xl font-bold text-indigo-600">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
              <p className="text-3xl font-bold text-indigo-600">$0</p>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
