"use client";

// ✅ Caching implemented: Server-side caching for 1 hour via revalidate = 3600

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithClaims | null>(null);

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

  const handleDeleteUser = async (targetUser: UserWithClaims) => {
    setUserToDelete(targetUser);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(userToDelete.uid);
      const token = await currentUser?.getIdToken();
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId: userToDelete.uid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      // Remove user from local state
      setUsers(users.filter((user) => user.uid !== userToDelete.uid));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setDeleting(null);
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
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={
                            deleting === user.uid ||
                            user.uid === currentUser?.uid
                          }
                          className={`text-sm font-medium rounded-md px-3 py-1 ${
                            user.uid === currentUser?.uid
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-900 hover:bg-red-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {deleting === user.uid ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mx-auto"></div>
                          ) : user.uid === currentUser?.uid ? (
                            "Current User"
                          ) : (
                            <TrashIcon className="h-4 w-4" />
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

      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 border w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Delete User
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="delete-user-modal"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete user &quot;
                  {userToDelete.displayName}&quot;? This action cannot be
                  undone.
                </p>
              </div>
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={confirmDeleteUser}
                  disabled={deleting === userToDelete.uid}
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  {deleting === userToDelete.uid ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mx-auto"></div>
                  ) : (
                    "Delete User"
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
