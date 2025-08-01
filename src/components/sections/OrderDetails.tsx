"use client";

import { Order } from "@/lib/types/order";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { OrderItem } from "@/lib/types/orderItem";
import { useState } from "react";

export default function OrderDetails({ order }: { order: Order }) {
  const { user } = useAuth();
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(
    new Set()
  );

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

      // For registered users, send userId
      if (user) {
        requestBody.userId = user.uid;
      } else {
        // For guest users, send order information
        requestBody.orderId = order.id;
        requestBody.paymentId = order.payment_id;
      }

      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <main className="relative lg:min-h-full">
      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-1">
            <Image
              src="/images/Hero.png"
              alt="Success"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-start-2">
            <h1 className="text-sm font-medium text-green-500 mt-4 lg:mt-0">
              Payment successful
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Thanks for your order!
            </p>
            <p className="mt-2 text-base text-gray-200 max-w-md">
              Here are the details of your order. An email confirmation is sent
              to your email address.
            </p>

            <dl className="mt-8 text-sm font-medium text-gray-400 space-y-1">
              <div>
                <dt className="text-gray-300">Order ID</dt>
                <dd className="text-primary break-all">{order.id}</dd>
              </div>
              <div>
                <dt className="text-gray-300">E-mail</dt>
                <dd className="text-white">{order.customer_email}</dd>
              </div>
              <div>
                <dt className="text-gray-300">Date</dt>
                <dd className="text-white">
                  {order.created_at instanceof Date
                    ? order.created_at.toLocaleString()
                    : typeof order.created_at === "string"
                      ? new Date(order.created_at).toLocaleString()
                      : "Unknown"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-300">Status</dt>
                <dd className="text-white capitalize">{order.status}</dd>
              </div>
            </dl>

            <p className="text-white font-semibold text-2xl mt-8">
              Your products:
            </p>
            <ul
              role="list"
              className="mt-8 divide-y divide-gray-700 border-t border-gray-700 text-sm font-medium text-gray-300"
            >
              {order.orderItems.map((item) => {
                const isDownloading = downloadingItems.has(item.id);

                return (
                  <li
                    key={item.id}
                    className="flex space-x-6 py-6 items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm lg:text-lg">
                        {item.title}
                      </h3>
                    </div>
                    <p className="flex-none font-medium text-white text-sm lg:text-lg">
                      ${item.price}
                    </p>
                    <button
                      onClick={() => handleDownload(item)}
                      disabled={isDownloading}
                      className={`ml-4 p-2 rounded-full transition-all duration-300 ${
                        isDownloading
                          ? "bg-green-600/80 cursor-not-allowed"
                          : "bg-primary/80 hover:bg-primary/70 hover:scale-110"
                      }`}
                      title={isDownloading ? "Downloading..." : "Download file"}
                    >
                      {isDownloading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <dl className="space-y-6 border-t border-white pt-6 font-medium mt-8">
              <div className="flex items-center justify-between text-md lg:text-xl text-white font-bold">
                <dt>Total</dt>
                <dd>${order.total_price}</dd>
              </div>
            </dl>

            <div className="mt-8 border-t border-white py-6 text-right">
              <Link
                href="/"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
