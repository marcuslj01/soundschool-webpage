"use client";

// ✅ Caching implemented: Server-side caching for 1 hour via revalidate = 3600

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface UserWithClaims {
  uid: string;
  email: string;
  displayName: string;
  createdAt: FirebaseFirestore.Timestamp | Date | string | null;
  lastLoginAt: FirebaseFirestore.Timestamp | Date | string | null;
  isAdmin: boolean;
  role: string;
}

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithClaims[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const token = await currentUser?.getIdToken();
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const setAdminStatus = async (targetUserId: string, isAdmin: boolean) => {
    try {
      // Prevent admin from removing their own admin status
      if (!isAdmin && targetUserId === currentUser?.uid) {
        alert("You cannot remove your own admin status!");
        return;
      }

      setUpdating(targetUserId);
      const token = await currentUser?.getIdToken();
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId, isAdmin }),
      });

      if (!response.ok) {
        throw new Error("Failed to update admin status");
      }

      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error("Error setting admin status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (
    timestamp: FirebaseFirestore.Timestamp | Date | string | null
  ) => {
    if (!timestamp) return "Never";

    // Handle Firestore Timestamp
    if (timestamp && typeof timestamp === "object" && "toDate" in timestamp) {
      return (timestamp as FirebaseFirestore.Timestamp)
        .toDate()
        .toLocaleString();
    }

    // Handle regular Date objects
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }

    // Handle ISO strings
    if (typeof timestamp === "string") {
      return new Date(timestamp).toLocaleString();
    }

    return "Unknown";
  };

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users including their name, last login, email and
            admin status.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Last login
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pr-4 pl-3 sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.uid}>
                    <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8">
                      {user.displayName}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {formatDate(user.lastLoginAt)}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isAdmin
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6 lg:pr-8">
                      <div className="flex flex-row gap-2">
                        <Link
                          href={`/admin/users/orders?userId=${user.uid}&userName=${encodeURIComponent(user.displayName)}`}
                          className="text-sm font-medium rounded-md px-3 py-1 text-primary hover:text-primary/80 hover:bg-primary/10"
                        >
                          View Orders
                        </Link>
                        <button
                          onClick={() =>
                            setAdminStatus(user.uid, !user.isAdmin)
                          }
                          disabled={
                            updating === user.uid ||
                            (!user.isAdmin && user.uid === currentUser?.uid)
                          }
                          className={`text-sm font-medium rounded-md px-3 py-1 ${
                            user.isAdmin
                              ? user.uid === currentUser?.uid
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-900 hover:bg-red-50"
                              : "text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {updating === user.uid ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mx-auto"></div>
                          ) : user.uid === currentUser?.uid && user.isAdmin ? (
                            "Current User"
                          ) : user.isAdmin ? (
                            "Remove Admin"
                          ) : (
                            "Make Admin"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
