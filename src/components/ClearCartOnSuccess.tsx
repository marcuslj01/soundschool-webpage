"use client";
import { useEffect } from "react";

export default function ClearCartOnSuccess() {
  useEffect(() => {
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new Event("cart-updated"));
  }, []);
  return null;
}
