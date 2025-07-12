import { CartItem } from "./types/cartItem";

const CART_KEY = "cartItems";

function fireCartUpdated() {
  window.dispatchEvent(new Event("cart-updated"));
}

// Get all cart items
export function getCartItems() {
  if (typeof window !== "undefined") {
    const cartItems = localStorage.getItem(CART_KEY);
    return cartItems ? JSON.parse(cartItems) : [];
  }
  return [];
}

// Add an item to the cart
export function addToCart(item: CartItem) {
  const cartItems = getCartItems();
  // Check if item already exists in cart
  if (!cartItems.find((i: CartItem) => i.id === item.id && i.type === item.type)) {
    cartItems.push(item);
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    fireCartUpdated();
  }
}

// Remove an item from the cart
export function removeFromCart(id: string) {
  const cartItems = getCartItems();
  const updatedItems = cartItems.filter((i: CartItem) => i.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
  fireCartUpdated();
}

export function isInCart(id: string, type: string) {
  return getCartItems().some((i: CartItem) => i.id === id && i.type === type);
}
