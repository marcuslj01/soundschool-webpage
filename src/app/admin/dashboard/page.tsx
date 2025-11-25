// src/app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface MonthlyStats {
  current: {
    orders: number;
    revenue: number;
  };
  previous: {
    orders: number;
    revenue: number;
  };
  change: {
    orders: number;
    revenue: number;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    monthly: null as MonthlyStats | null,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return "↑";
    if (value < 0) return "↓";
    return "→";
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome to Admin Dashboard
      </h1>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Users</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.users}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.orders}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                ${(stats.revenue || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {stats.monthly && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                This month vs. last month
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Orders this month
                  </h3>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-bold text-indigo-600">
                      {stats.monthly.current.orders}
                    </p>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-sm font-medium ${getChangeColor(stats.monthly.change.orders)}`}
                      >
                        {getChangeIcon(stats.monthly.change.orders)}
                      </span>
                      <span
                        className={`text-sm font-medium ${getChangeColor(stats.monthly.change.orders)}`}
                      >
                        {formatPercentage(stats.monthly.change.orders)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {stats.monthly.previous.orders} orders last month
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Revenue this month
                  </h3>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-bold text-indigo-600">
                      ${stats.monthly.current.revenue.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-sm font-medium ${getChangeColor(stats.monthly.change.revenue)}`}
                      >
                        {getChangeIcon(stats.monthly.change.revenue)}
                      </span>
                      <span
                        className={`text-sm font-medium ${getChangeColor(stats.monthly.change.revenue)}`}
                      >
                        {formatPercentage(stats.monthly.change.revenue)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    ${stats.monthly.previous.revenue.toFixed(2)} last month
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
