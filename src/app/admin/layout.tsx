// src/app/admin/layout.tsx
"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import AdminGuard from "@/components/security/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto mt-20">{children}</div>
      </div>
    </AdminGuard>
  );
}
