"use client";

import { useEffect, useState } from "react";
import {} from "@headlessui/react";
import {
  XMarkIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { getCartItems, removeFromCart } from "@/lib/cart";
import { CartItem } from "@/lib/types/cartItem";
import BackButton from "@/components/ui/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { getOwnedFiles } from "@/lib/firestore/user";

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    setCartItems(getCartItems());
    setIsMounted(true);
    // Listen for cart-updated event hvis du vil ha live oppdatering:
    const update = () => setCartItems(getCartItems());
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  if (!isMounted) {
    // Avoid showing anything before we have cart from localStorage
    return null;
  }

  const handleRemoveFromCart = (cartItemsId: string) => {
    removeFromCart(cartItemsId);
  };

  const subtotalPrice = cartItems.reduce(
    (sum: number, item: CartItem) =>
      sum + Number(item.is_discounted ? item.discount_price : item.price),
    0
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        setShowCheckoutModal(true);
        return;
      }

      const ownedFiles = await getOwnedFiles(user.uid);
      const isOwned = cartItems.some((item) =>
        ownedFiles.some((ownedFile) => ownedFile.id === item.id)
      );
      if (isOwned) {
        alert(
          `You already own some of these items: ${ownedFiles
            .filter((file) => cartItems.some((item) => item.id === file.id))
            .map((file) => file.name)
            .join(
              ", "
            )}. Please remove them from your cart before checking out.`
        );
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          userId: user?.uid || null,
          email: user?.email || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Send user to Stripe Checkout
      } else {
        alert("Something went wrong with payment. Please try again!");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong with payment. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestCheckout = async () => {
    setShowCheckoutModal(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
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

  // TODO: tax not included for now
  //   const tax = subtotalPrice * 0.25; // 25% tax (MVA)
  const totalPrice = subtotalPrice; // + tax;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
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
                    window.location.pathname + window.location.search
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

      <main className="mx-auto max-w-7xl px-4 pt-24 pb-32 sm:px-6 lg:px-8 md:pb-24">
        <div className="mb-8">
          <BackButton />
          <div className="mt-6 flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <ShoppingBagIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Shopping Cart
              </h1>
              <p className="text-gray-400 mt-1">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>
          </div>
        </div>

        <form
          className="md:grid md:grid-cols-12 md:gap-8"
          onSubmit={handleCheckout}
        >
          {/* Cart items - Second on mobile, first on desktop */}
          <section
            aria-labelledby="cart-heading"
            className="md:col-span-8 md:order-1 mt-8 md:mt-0"
          >
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-800 mb-6">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Looks like you haven&apos;t added any items to your cart yet.
                  Start shopping to discover amazing sounds!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  Browse items
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((cartItems: CartItem) => (
                  <div
                    key={cartItems.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors duration-200">
                              <Link
                                href={`/pack?id=${cartItems.id}`}
                                className="hover:underline"
                              >
                                {cartItems.title}
                              </Link>
                            </h3>

                            <div className="mt-2 flex items-center gap-3">
                              {cartItems.is_discounted ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400 line-through text-sm">
                                    ${cartItems.price}
                                  </span>
                                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-sm font-medium">
                                    ${cartItems.discount_price}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-white font-semibold">
                                  ${cartItems.price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ml-4 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group/btn hover:cursor-pointer"
                        onClick={() => handleRemoveFromCart(cartItems.id)}
                      >
                        <span className="sr-only">Remove</span>
                        <TrashIcon className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Order summary - First on mobile, second on desktop */}
          <section
            aria-labelledby="summary-heading"
            className="md:col-span-4 md:order-2"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 fixed bottom-0 left-0 right-0 z-40 md:sticky md:top-8 md:z-auto">
              <h2
                id="summary-heading"
                className="text-xl font-bold text-white mb-6 flex items-center gap-2"
              >
                <ShoppingBagIcon className="h-5 w-5 text-primary" />
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white font-semibold">
                    ${subtotalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {cartItems.length > 0 ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-primary/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:cursor-pointer"
                  >
                    {isLoading ? "Processing..." : "Proceed to Checkout"}
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">
                      Add some items to get started
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium"
                    >
                      <ShoppingBagIcon className="h-4 w-4" />
                      Browse items
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
