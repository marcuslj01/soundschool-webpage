"use client";

import { Order } from "@/lib/types/order";
import { useState, useEffect } from "react";
import Link from "next/link";
import { OrderItem } from "@/lib/types/orderItem";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import BackButton from "@/components/ui/BackButton";
import { useAuth } from "@/contexts/AuthContext";

interface UserOrdersPageProps {
  searchParams: Promise<{ userId?: string; userName?: string }>;
}

export default function UserOrdersPage({ searchParams }: UserOrdersPageProps) {
  const { user: currentUser } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("Component rendered with:", {
    currentUser: !!currentUser,
    userId,
    userName,
  });

  // get userId from searchParams
  useEffect(() => {
    async function getUserId() {
      console.log("getUserId useEffect triggered");
      const params = await searchParams;
      console.log("Search params:", params);
      setUserId(params.userId || null);
      setUserName(params.userName || null);
    }
    getUserId();
  }, [searchParams]);

  useEffect(() => {
    console.log("fetchOrders useEffect triggered with:", {
      userId,
      currentUser: !!currentUser,
    });

    async function fetchOrders() {
      console.log("fetchOrders called with:", {
        userId,
        currentUser: !!currentUser,
      });

      if (userId && currentUser) {
        try {
          console.log("Getting token...");
          const token = await currentUser.getIdToken();
          console.log("Token received, making API call...");

          const response = await fetch(
            `/api/admin/user-orders?userId=${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("API response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("API error:", errorText);
            throw new Error(
              `Failed to fetch orders: ${response.status} ${errorText}`
            );
          }

          const userOrders = await response.json();
          console.log("Orders received:", userOrders);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
          alert(`Error loading orders: ${error}`);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("Missing userId or currentUser:", {
          userId,
          currentUser: !!currentUser,
        });
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId, currentUser]);

  function handleProductLink(product: OrderItem, type: string) {
    if (type === "midi") {
      return `/midi?id=${product.id}`;
    } else if (type === "pack") {
      return `/pack?id=${product.id}`;
    }
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown";

    if (date instanceof Date) {
      return date.toLocaleDateString();
    }

    if (typeof date === "string") {
      return new Date(date).toLocaleDateString();
    }

    return "Unknown";
  };

  const formatDateTime = (date: Date | string | null) => {
    if (!date) return "Unknown";

    if (date instanceof Date) {
      return date.toISOString();
    }

    if (typeof date === "string") {
      return new Date(date).toISOString();
    }

    return "Unknown";
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (!userId) {
    return <div>No user ID provided</div>;
  }

  return (
    <>
      <div className="bg-white min-h-screen">
        <div className="flex flex-row gap-2 p-6">
          <BackButton />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:pb-24">
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Order history for user: {userName}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Check the status of recent orders, view owned products, and
              download previous purchases.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="sr-only">Recent orders</h2>

            {orders.length === 0 && (
              <div className="text-center text-gray-500">
                <p className="mb-4">This user has no orders yet.</p>
                <Link
                  href="/admin/users"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors duration-300"
                >
                  Back to Users
                </Link>
              </div>
            )}

            <div className="space-y-20">
              {orders.map((order) => (
                <div key={order.id}>
                  <h3 className="sr-only">
                    Order placed on{" "}
                    <time dateTime={formatDateTime(order.created_at)}>
                      {formatDate(order.created_at)}
                    </time>
                  </h3>

                  <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                    <dl className="flex-auto divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:divide-y-0 lg:gap-x-8">
                      <div className="flex justify-between py-4 sm:block sm:py-0">
                        <dt className="font-medium text-gray-900">
                          Date placed
                        </dt>
                        <dd className="sm:mt-1">
                          <time dateTime={formatDateTime(order.created_at)}>
                            {formatDate(order.created_at)}
                          </time>
                        </dd>
                      </div>
                      <div className="flex justify-between py-4 sm:block sm:py-0">
                        <dt className="font-medium text-gray-900">
                          Total amount
                        </dt>
                        <dd className="text-gray-900 sm:mt-1">
                          ${order.total_price}
                        </dd>
                      </div>
                      <div className="flex justify-between py-4 sm:block sm:py-0">
                        <dt className="font-medium text-gray-900">Status</dt>
                        <dd className="sm:mt-1">
                          <p className="text-gray-500">
                            {order.status === "paid" ? "Paid" : "Pending"}
                          </p>
                        </dd>
                      </div>
                      <div className="flex justify-between py-4 sm:block sm:py-0">
                        <dt className="font-medium text-gray-900">Order ID</dt>
                        <dd className="sm:mt-1">{order.id}</dd>
                      </div>
                    </dl>
                  </div>

                  <table className="mt-4 w-full text-gray-500 sm:mt-6">
                    <caption className="sr-only">Products</caption>
                    <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                      <tr>
                        <th
                          scope="col"
                          className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3 pr-8 font-normal sm:table-cell"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3 pr-8 font-normal sm:table-cell"
                        >
                          Download
                        </th>
                        <th scope="col" className="w-0 py-3 font-normal">
                          Info
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                      {order.orderItems.map((product) => (
                        <tr key={product.id}>
                          <td className="py-6 pr-8">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {product.title}
                                </div>
                                <div className="mt-1 sm:hidden">
                                  ${product.price}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden py-6 pr-8 sm:table-cell">
                            ${product.price}
                          </td>
                          <td className="hidden py-6 pr-8 sm:table-cell">
                            {product.type === "midi"
                              ? "MIDI"
                              : product.type === "pack"
                                ? "Pack"
                                : "Product"}
                          </td>
                          <td className="py-6 sm:pr-8 sm:table-cell">
                            <a
                              href={product.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 transition-colors inline-flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300 hover:cursor-pointer"
                              title="Download file"
                            >
                              <ArrowDownTrayIcon className="w-4 h-4 text-black" />
                            </a>
                          </td>
                          <td className="py-6 text-right font-medium whitespace-nowrap">
                            <a
                              href={handleProductLink(product, product.type)}
                              className="text-indigo-600"
                            >
                              View
                              <span className="hidden lg:inline"> Product</span>
                              <span className="sr-only">, {product.title}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
