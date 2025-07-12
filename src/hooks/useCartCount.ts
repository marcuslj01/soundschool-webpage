// src/hooks/useCartCount.ts
import { useEffect, useState } from "react";
import { getCartItems } from "@/lib/cart";

export function useCartCount() {
  const [count, setCount] = useState(() => getCartItems().length);

  useEffect(() => {
    const update = () => setCount(getCartItems().length);

    // Listen for custom event
    window.addEventListener("cart-updated", update);

    // Listen for storage event
    window.addEventListener("storage", (e) => {
      if (e.key === "cartItems") update();
    });

    return () => {
      window.removeEventListener("cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return count;
}