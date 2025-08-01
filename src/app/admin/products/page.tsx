"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import UploadModal from "@/components/ui/UploadModal";
import { Pack } from "@/lib/types/pack";
import { Midi } from "@/lib/types/midi";
import { FLP } from "@/lib/types/FLP";

export default function Products() {
  const { user: currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [midis, setMidis] = useState<Midi[]>([]);
  const [flps, setFlps] = useState<FLP[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"packs" | "midis" | "flps">(
    "packs"
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const token = await currentUser?.getIdToken();

      // Fetch packs
      const packsResponse = await fetch("/api/admin/products?type=packs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch midis
      const midisResponse = await fetch("/api/admin/products?type=midis", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch FLPs
      const flpsResponse = await fetch("/api/admin/products?type=flps", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (packsResponse.ok) {
        const packsData = await packsResponse.json();
        setPacks(packsData);
      }

      if (midisResponse.ok) {
        const midisData = await midisResponse.json();
        setMidis(midisData);
      }

      if (flpsResponse.ok) {
        const flpsData = await flpsResponse.json();
        setFlps(flpsData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (type: "packs" | "midis" | "flps", id: string) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${type === "packs" ? "pack" : type === "midis" ? "MIDI file" : "FLP"}?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      const token = await currentUser?.getIdToken();

      const response = await fetch(
        `/api/admin/products?type=${type}&id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove from local state
        if (type === "packs") {
          setPacks((prev) => prev.filter((pack) => pack.id !== id));
        } else if (type === "midis") {
          setMidis((prev) => prev.filter((midi) => midi.id !== id));
        } else if (type === "flps") {
          setFlps((prev) => prev.filter((flp) => flp.id !== id));
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

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

  useEffect(() => {
    if (currentUser) {
      fetchProducts();
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
          <h1 className="text-base font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your packs and MIDI files. Add new products, edit existing
            ones, and track sales.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            text="Add Product +"
            style="primary"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("packs")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "packs"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Packs ({packs.length})
          </button>
          <button
            onClick={() => setActiveTab("midis")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "midis"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            MIDI Files ({midis.length})
          </button>
          <button
            onClick={() => setActiveTab("flps")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "flps"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            FLPs ({flps.length})
          </button>
        </nav>
      </div>

      {/* Packs Table */}
      {activeTab === "packs" && (
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
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Sales
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Created
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
                  {packs.map((pack) => (
                    <tr key={pack.id}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8">
                        {pack.name}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {pack.type || "N/A"}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {formatPrice(pack.price)}
                        {pack.is_discounted && pack.discount_price && (
                          <span className="ml-2 text-red-600">
                            → {formatPrice(pack.discount_price)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {pack.sales || 0}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="flex space-x-1">
                          {pack.hidden && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                              Hidden
                            </span>
                          )}
                          {pack.is_featured && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                          {pack.is_discounted && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                              Discounted
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {formatDate(pack.created_at)}
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6 lg:pr-8">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                          Edit
                        </button>
                        <button
                          className={`text-red-600 hover:text-red-900 ${
                            deletingId === pack.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => handleDelete("packs", pack.id)}
                          disabled={deletingId === pack.id}
                        >
                          {deletingId === pack.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MIDI Files Table */}
      {activeTab === "midis" && (
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
                      Genre
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      BPM
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Sales
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Created
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
                  {midis.map((midi) => (
                    <tr key={midi.id}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8">
                        {midi.name}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {midi.genre}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {midi.bpm}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {formatPrice(midi.price)}
                        {midi.is_discounted && midi.discount_price && (
                          <span className="ml-2 text-red-600">
                            → {formatPrice(midi.discount_price)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {midi.sales || 0}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="flex space-x-1">
                          {midi.hidden && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                              Hidden
                            </span>
                          )}
                          {midi.is_featured && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                          {midi.is_discounted && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                              Discounted
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {formatDate(midi.created_at)}
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6 lg:pr-8">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4 hover:cursor-pointer">
                          Edit
                        </button>
                        <button
                          className={`text-red-600 hover:text-red-900 hover:cursor-pointer ${
                            deletingId === midi.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => handleDelete("midis", midi.id)}
                          disabled={deletingId === midi.id}
                        >
                          {deletingId === midi.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FLPs Table */}
      {activeTab === "flps" && (
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
                      Genre
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      BPM
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Key
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Sales
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Created
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
                  {flps.map((flp) => (
                    <tr key={flp.id}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8">
                        {flp.name}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {flp.genre}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {flp.bpm}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {flp.root} {flp.scale}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {formatPrice(flp.price)}
                        {flp.is_discounted && flp.discount_price && (
                          <span className="ml-2 text-red-600">
                            → {formatPrice(flp.discount_price)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {flp.sales || 0}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="flex space-x-1">
                          {flp.hidden && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                              Hidden
                            </span>
                          )}
                          {flp.is_featured && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                          {flp.is_discounted && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                              Discounted
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {formatDate(flp.created_at)}
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6 lg:pr-8">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4 hover:cursor-pointer">
                          Edit
                        </button>
                        <button
                          className={`text-red-600 hover:text-red-900 hover:cursor-pointer ${
                            deletingId === flp.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => handleDelete("flps", flp.id)}
                          disabled={deletingId === flp.id}
                        >
                          {deletingId === flp.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isOpen && <UploadModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}
