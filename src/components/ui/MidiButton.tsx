"use client";

import { addToCart, getCartItems, removeFromCart } from "@/lib/cart";
import { CartItem } from "@/lib/types/cartItem";
import { CheckCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

interface MidiButtonProps {
  midi: {
    id: string;
    name: string;
    price: number;
    type: string;
  };
}

export default function MidiButton({ midi }: MidiButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const update = () => {
      const cartItems = getCartItems();
      setIsAdded(cartItems.some((item: CartItem) => item.id === midi.id));
    };
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, [midi.id]);

  const handleAddToCart = (item: CartItem) => {
    if (isAdded) {
      // Remove item from cart
      removeFromCart(midi.id);
      setIsAdded(false);
    } else if (!isAdded) {
      // Add item to cart
      addToCart(item);
      setIsAdded(true);
    }
  };

  return (
    <div className="w-full">
      {isAdded ? (
        <button
          className="bg-primary/20 text-white rounded-md w-full px-4 py-2 flex items-center justify-center flex-row hover:bg-primary/10 hover:cursor-pointer transition-all duration-300"
          onClick={() =>
            handleAddToCart({
              id: midi.id,
              title: midi.name,
              price: midi.price,
              type: "midi",
            })
          }
        >
          <div className="flex items-center justify-center gap-2">
            <p>In Cart</p>
            <CheckCircleIcon className="w-4 h-4" />
          </div>
        </button>
      ) : (
        <button
          className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 hover:cursor-pointer hover:scale-102 transition-all duration-300"
          onClick={() =>
            handleAddToCart({
              id: midi.id,
              title: midi.name,
              price: midi.price,
              type: "midi",
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
  );
}
