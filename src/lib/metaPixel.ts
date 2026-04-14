// Utility functions for Meta Pixel tracking

declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName?: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
  }
}

/**
 * Track AddToCart event
 */
export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  currency?: string;
}) {
  if (typeof window === "undefined") {
    console.warn("Meta Pixel: window is undefined");
    return;
  }
  
  if (!window.fbq) {
    console.warn("Meta Pixel: fbq is not available. Pixel may not be loaded yet or cookie consent not given.");
    return;
  }
  
  try {
    const eventData = {
      content_name: item.name,
      content_ids: [item.id],
      value: item.price,
      currency: item.currency || "USD",
    };
    
    console.log("Meta Pixel: Tracking AddToCart event", eventData);
    window.fbq("track", "AddToCart", eventData);
  } catch (error) {
    console.error("Meta Pixel AddToCart error:", error);
  }
}

/**
 * Track InitiateCheckout event
 */
export function trackInitiateCheckout(items: Array<{
  id: string;
  name: string;
  price: number;
  quantity?: number;
}>, subtotal: number, currency?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  
  try {
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    window.fbq("track", "InitiateCheckout", {
      content_ids: items.map(item => item.id),
      content_names: items.map(item => item.name),
      contents: items.map(item => ({
        id: item.id,
        quantity: item.quantity || 1,
      })),
      value: subtotal,
      num_items: totalQuantity,
      currency: currency || "USD",
    });
  } catch (error) {
    console.error("Meta Pixel InitiateCheckout error:", error);
  }
}

/**
 * Track Purchase event
 */
export function trackPurchase(
  transactionId: string,
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }>,
  total: number,
  currency?: string
) {
  if (typeof window === "undefined" || !window.fbq) return;
  
  try {
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    window.fbq("track", "Purchase", {
      content_ids: items.map(item => item.id),
      content_names: items.map(item => item.name),
      contents: items.map(item => ({
        id: item.id,
        quantity: item.quantity || 1,
      })),
      value: total,
      currency: currency || "USD",
      num_items: totalQuantity,
    }, { eventID: transactionId });
  } catch (error) {
    console.error("Meta Pixel Purchase error:", error);
  }
}

/**
 * Track ViewContent event (when viewing a product)
 */
export function trackViewContent(item: {
  id: string;
  name: string;
  price: number;
  type?: string;
  currency?: string;
}) {
  if (typeof window === "undefined" || !window.fbq) return;
  
  try {
    window.fbq("track", "ViewContent", {
      content_name: item.name,
      content_ids: [item.id],
      content_type: item.type || "product",
      value: item.price,
      currency: item.currency || "USD",
    });
  } catch (error) {
    console.error("Meta Pixel ViewContent error:", error);
  }
}

