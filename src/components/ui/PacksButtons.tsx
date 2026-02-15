"use client";

import { useAuth } from "@/contexts/AuthContext";
import { addToCart, getCartItems, removeFromCart } from "@/lib/cart";
import { getOwnedFiles } from "@/lib/firestore/user";
import { CartItem } from "@/lib/types/cartItem";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  XMarkIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Badge from "./Badge";
import { trackInitiateCheckout } from "@/lib/metaPixel";

interface PackButtonsProps {
  pack: {
    id: string;
    name: string;
    price: number;
    type: string;
    discount_price?: number;
    is_discounted?: boolean;
    hideAddToCart?: boolean; // If true, only show the buy now button
    color?: string;
  };
}

function PacksButtons({ pack }: PackButtonsProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { user } = useAuth();
  const [isOwned, setIsOwned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchOwnedFiles = async () => {
        const ownedFiles = await getOwnedFiles(user.uid);
        setIsOwned(
          ownedFiles.some(
            (ownedFile) =>
              ownedFile.id === pack.id && ownedFile.type === "pack",
          ),
        );
      };
      fetchOwnedFiles();
    }
  }, [user, pack.id]);

  useEffect(() => {
    const update = () => {
      const cartItems = getCartItems();
      setIsAdded(cartItems.some((item: CartItem) => item.id === pack.id));
    };
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, [pack.id]);

  const handleAddToCart = (item: CartItem) => {
    if (isAdded) {
      // Remove item from cart
      removeFromCart(pack.id);
      setIsAdded(false);
    } else if (!isAdded) {
      // Add item to cart
      addToCart(item);
      setIsAdded(true);
    }
  };

  const handleBuyNow = async () => {
    setIsLoading(true);

    try {
      if (!user) {
        setShowCheckoutModal(true);
        setIsLoading(false);
        return;
      }

      const ownedFiles = await getOwnedFiles(user.uid);
      const isItemOwned = ownedFiles.some(
        (ownedFile) => ownedFile.id === pack.id && ownedFile.type === "pack",
      );

      if (isItemOwned) {
        alert("You already own this item!");
        return;
      }

      const cartItem: CartItem = {
        id: pack.id,
        title: pack.name,
        price: pack.price,
        discount_price: pack.is_discounted ? pack.discount_price : undefined,
        is_discounted: pack.is_discounted,
        type: "pack",
      };

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: [cartItem],
          userId: user?.uid || null,
          email: user?.email || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        // Track InitiateCheckout event for Meta Pixel
        const price = pack.is_discounted
          ? pack.discount_price || pack.price
          : pack.price;
        trackInitiateCheckout(
          [
            {
              id: pack.id,
              name: pack.name,
              price: price,
            },
          ],
          price,
        );

        window.location.href = data.url; // Send user to Stripe Checkout
      } else {
        alert("Something went wrong with payment. Please try again!");
      }
    } catch (error) {
      console.error("Buy now error:", error);
      alert("Something went wrong with payment. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestCheckout = async () => {
    setShowCheckoutModal(false);
    setIsLoading(true);

    try {
      const cartItem: CartItem = {
        id: pack.id,
        title: pack.name,
        price: pack.price,
        discount_price: pack.is_discounted ? pack.discount_price : undefined,
        is_discounted: pack.is_discounted,
        type: "pack",
      };

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: [cartItem],
          userId: null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong with payment. Please try again!");
      }
    } catch (error) {
      console.error("Guest checkout error:", error);
      alert("Something went wrong with payment. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isOwned) {
    return (
      <div className="w-full">
        <div className="mb-2">
          <Badge text="You own this pack!" style="indigo" />
        </div>
        <Link
          href="/my-files"
          className="bg-green-700 text-white text-sm rounded-md w-full h-8 px-1 flex items-center justify-center flex-row hover:bg-green-800 hover:cursor-pointer transition-all duration-300"
        >
          <p>My Files</p> <ArrowRightIcon className="ml-1 w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Modal Overlay */}
      {showCheckoutModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCheckoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <ShoppingBagIcon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                How would you like to checkout?
              </h2>
              <p className="text-gray-600 mb-8">
                You can continue as a guest or sign in to your account.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full block text-center bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                onClick={() => {
                  setShowCheckoutModal(false);
                  // Save current page for redirect after login
                  sessionStorage.setItem(
                    "redirectAfterLogin",
                    window.location.pathname + window.location.search,
                  );
                }}
              >
                Sign in to your account
              </Link>

              <button
                onClick={handleGuestCheckout}
                disabled={isLoading}
                className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                {isLoading ? "Processing..." : "Continue as guest"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col gap-2">
        {isAdded ? (
          <button
            className="bg-primary/20 text-white rounded-md w-full px-4 py-2 flex items-center justify-center flex-row hover:bg-primary/10 hover:cursor-pointer transition-all duration-300"
            onClick={() =>
              handleAddToCart({
                id: pack.id,
                title: pack.name,
                price: pack.price,
                discount_price: pack.is_discounted
                  ? pack.discount_price
                  : undefined,
                is_discounted: pack.is_discounted,
                type: "pack",
              })
            }
          >
            <div className="flex items-center justify-center gap-2">
              <p>In Cart</p>
              <CheckCircleIcon className="w-4 h-4" />
            </div>
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {pack.color === "white" ? (
              <button
                className="w-full bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-white/80 hover:cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                onClick={handleBuyNow}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  <p>{isLoading ? "Processing..." : "Buy Now"}</p>{" "}
                  <CreditCardIcon className="w-4 h-4" />
                </div>
              </button>
            ) : (
              <button
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 hover:cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                onClick={handleBuyNow}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  <p>{isLoading ? "Processing..." : "Buy Now"}</p>
                  <CreditCardIcon className="w-4 h-4" />
                </div>
              </button>
            )}
            {!pack.hideAddToCart && (
              <button
                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 hover:cursor-pointer hover:scale-102 transition-all duration-300"
                onClick={() =>
                  handleAddToCart({
                    id: pack.id,
                    title: pack.name,
                    price: pack.price,
                    discount_price: pack.is_discounted
                      ? pack.discount_price
                      : undefined,
                    is_discounted: pack.is_discounted,
                    type: "pack",
                  })
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <p>Add to Cart</p>
                  <ShoppingCartIcon className="w-4 h-4" />
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default PacksButtons;
