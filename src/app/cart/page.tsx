"use client";

import { useEffect, useState } from "react";
import {} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
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
    (sum: number, item: CartItem) => sum + Number(item.price),
    0
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

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
          .join(", ")}. Please remove them from your cart before checking out.`
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
    const data = await response.json();

    if (data.url) {
      window.location.href = data.url; // Send user to Stripe Checkout
    } else {
      alert("Something went wrong with payment. Please try again!");
    }
  };

  const handleGuestCheckout = async () => {
    setShowCheckoutModal(false);

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems,
        userId: null,
      }),
    });
    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong with payment. Please try again!");
    }
  };

  // TODO: tax not included for now
  //   const tax = subtotalPrice * 0.25; // 25% tax (MVA)
  const totalPrice = subtotalPrice; // + tax;

  return (
    <div className="min-h-screen">
      {/* Modal Overlay */}
      {showCheckoutModal && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowCheckoutModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 hover:cursor-pointer"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4 pr-8">
              How would you like to checkout?
            </h2>
            <p className="text-gray-600 mb-6">
              You can continue as a guest or sign in to your account.
            </p>

            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full block text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80  transition-colors cursor-pointer duration-300"
                onClick={() => {
                  setShowCheckoutModal(false);
                  // Save current page for redirect after login
                  sessionStorage.setItem(
                    "redirectAfterLogin",
                    window.location.pathname + window.location.search
                  );
                }}
              >
                Sign in
              </Link>

              <button
                onClick={handleGuestCheckout}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors cursor-pointer duration-300"
              >
                Continue as guest
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-2xl px-4 pt-24 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <BackButton />
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mt-4">
          Shopping Cart
        </h1>

        <form
          className="mt-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
          onSubmit={handleCheckout}
        >
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {cartItems.map((cartItems: CartItem) => (
                <li key={cartItems.id} className="flex py-6 sm:py-10">
                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <a
                              href={`/pack?id=${cartItems.id}`}
                              className="text-xl text-gray-200 hover:text-gray-300"
                            >
                              {cartItems.title}
                            </a>
                          </h3>
                        </div>

                        <p className="mt-1 text-sm font-medium text-gray-300">
                          ${cartItems.price}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="absolute top-0 right-0">
                          <button
                            type="button"
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-red-500 hover:cursor-pointer"
                            onClick={() => handleRemoveFromCart(cartItems.id)}
                          >
                            <span className="sr-only">Remove</span>
                            <XMarkIcon aria-hidden="true" className="size-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${subtotalPrice}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  ${totalPrice}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-primary/80 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden hover:scale-102 cursor-pointer"
              >
                Checkout
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
