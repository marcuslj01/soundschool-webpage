"use client";
import { useEffect } from "react";

export default function ClearCartOnSuccess() {
  useEffect(() => {
    // Clear the cart after successful purchase
    // Purchase tracking is handled by TrackPurchase component with correct order ID
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new Event("cart-updated"));
  }, []);
  return null;
}
