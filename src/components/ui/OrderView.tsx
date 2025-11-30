"use client";

import React from "react";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Order } from "@/lib/types/order";
import { OrderItem } from "@/lib/types/orderItem";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface OrderViewProps {
  order: Order;
  onClose: () => void;
}

export default function OrderView({ order, onClose }: OrderViewProps) {
  const { user } = useAuth();
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(
    new Set()
  );

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown";

    if (date instanceof Date) {
      return date.toLocaleString();
    }

    if (typeof date === "string") {
      return new Date(date).toLocaleString();
    }

    return "Unknown";
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleProductLink = (product: OrderItem, type: string) => {
    if (type === "midi") {
      return `/midi?id=${product.id}`;
    } else if (type === "pack") {
      return `/pack?id=${product.id}`;
    } else if (type === "flp") {
      return `/flp?id=${product.id}`;
    }
    return "#";
  };

  const handleDownload = async (item: OrderItem) => {
    // Add item to downloading set
    setDownloadingItems((prev) => new Set(prev).add(item.id));

    try {
      const requestBody: {
        fileId: string;
        fileType: string;
        userId?: string;
        orderId?: string;
        paymentId?: string;
      } = {
        fileId: item.id,
        fileType: item.type,
      };

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // For registered users, send userId and auth token
      if (user) {
        requestBody.userId = user.uid;
        const token = await user.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      } else {
        // For guest users, send order information
        requestBody.orderId = order.id;
        requestBody.paymentId = order.payment_id;
      }

      const response = await fetch("/api/download", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const { downloadUrl, fileName } = await response.json();

      // Trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    } finally {
      // Remove item from downloading set
      setDownloadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Information
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Order ID
                  </dt>
                  <dd className="text-sm text-gray-900">{order.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Payment ID
                  </dt>
                  <dd className="text-sm text-gray-900">{order.payment_id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Date Created
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(order.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Refunded
                  </dt>
                  <dd className="text-sm">
                    {order.refunded ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        No
                      </span>
                    )}
                  </dd>
                </div>
                {order.refund_reason && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Refund Reason
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {order.refund_reason}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Information
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">
                    {order.customer_name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">
                    {order.customer_email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="text-sm text-gray-900">
                    {order.userId || "Guest User"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Amount
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatPrice(order.total_price)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items ({order.orderItems.length})
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems.map((item, index) => (
                    <tr key={`${item.id}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.type === "midi"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleDownload(item)}
                          disabled={downloadingItems.has(item.id)}
                          className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                            downloadingItems.has(item.id)
                              ? "text-green-700 bg-green-100 cursor-not-allowed"
                              : "text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          }`}
                          title={
                            downloadingItems.has(item.id)
                              ? "Downloading..."
                              : "Download file"
                          }
                        >
                          {downloadingItems.has(item.id) ? (
                            <div className="w-3 h-3 border-2 border-green-700 border-t-transparent rounded-full animate-spin mr-1" />
                          ) : (
                            <ArrowDownTrayIcon className="w-3 h-3 mr-1" />
                          )}
                          Download
                        </button>
                        <a
                          href={handleProductLink(item, item.type)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                        >
                          View Product
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Total Items: {order.orderItems.length}
                </p>
                <p className="text-sm text-gray-500">
                  Order Total: {formatPrice(order.total_price)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
