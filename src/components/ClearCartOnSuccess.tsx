"use client";
import { useEffect } from "react";
import { trackPurchase } from "@/lib/metaPixel";

export default function ClearCartOnSuccess() {
  useEffect(() => {
    // Track Purchase event for Meta Pixel
    // Get the cart items before clearing (they should be the purchased items)
    const lastCartItems = localStorage.getItem("cartItems");
    
    if (lastCartItems) {
      try {
        const cartItems = JSON.parse(lastCartItems);
        const totalValue = cartItems.reduce(
          (sum: number, item: any) =>
            sum + Number(item.is_discounted ? item.discount_price : item.price),
          0
        );
        
        // Generate a simple transaction ID (you can improve this)
        const transactionId = `txn_${Date.now()}`;
        
        trackPurchase(
          transactionId,
          cartItems.map((item: any) => ({
            id: item.id,
            name: item.title,
            price: item.is_discounted ? item.discount_price || item.price : item.price,
          })),
          totalValue
        );
      } catch (error) {
        console.error("Error tracking purchase:", error);
      }
    }
    
    // Clear the cart
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new Event("cart-updated"));
  }, []);
  return null;
}
