"use client";

import { useEffect, useState } from "react";
import {} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { getCartItems, removeFromCart } from "@/lib/cart";
import { CartItem } from "@/lib/types/cartItem";

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

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

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems,
      }),
    });
    const data = await response.json();

    if (data.url) {
      window.location.href = data.url; // Send bruker til Stripe Checkout
    } else {
      alert("Noe gikk galt med betaling. Prøv igjen!");
    }
  };

  // TODO: tax not included for now
  //   const tax = subtotalPrice * 0.25; // 25% tax (MVA)
  const totalPrice = subtotalPrice; // + tax;

  return (
    <div className="bg-white min-h-screen">
      <main className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-4">
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
                              href={`/packs?id=${cartItems.id}`}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {cartItems.title}
                            </a>
                          </h3>
                        </div>

                        <p className="mt-1 text-sm font-medium text-gray-900">
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
              {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                  <a
                    href="#"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">${tax}</dd>
              </div> */}
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
                className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-primary/80 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden hover:scale-102 cursor-pointer"
                onClick={handleCheckout}
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
