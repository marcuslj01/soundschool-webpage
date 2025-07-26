"use client";

import { useAuth } from "@/contexts/AuthContext";
import { addToCart, getCartItems, removeFromCart } from "@/lib/cart";
import { getOwnedFiles } from "@/lib/firestore/user";
import { CartItem } from "@/lib/types/cartItem";
import { CheckCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface MidiButtonProps {
  midi: {
    id: string;
    name: string;
    price: number;
    type: string;
    discount_price?: number;
    is_discounted?: boolean;
  };
}

export default function MidiButton({ midi }: MidiButtonProps) {
  const { user } = useAuth();
  const [isOwned, setIsOwned] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchOwnedFiles = async () => {
        const ownedFiles = await getOwnedFiles(user.uid);
        setIsOwned(
          ownedFiles.some(
            (ownedFile) => ownedFile.id === midi.id && ownedFile.type === "midi"
          )
        );
      };
      fetchOwnedFiles();
    }
  }, [user, midi.id]);

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

  if (isOwned) {
    return (
      <div className="w-full">
        <Link
          href="/my-files"
          className="bg-green-600 text-white text-sm rounded-md w-full h-8 px-1 flex items-center justify-center flex-row hover:bg-green-700 hover:cursor-pointer transition-all duration-300"
        >
          <p>Already Owned</p> <CheckCircleIcon className="ml-2 w-4 h-4" />
        </Link>
      </div>
    );
  }
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
              discount_price: midi.is_discounted
                ? midi.discount_price
                : undefined,
              is_discounted: midi.is_discounted,
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
              discount_price: midi.is_discounted
                ? midi.discount_price
                : undefined,
              is_discounted: midi.is_discounted,
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
