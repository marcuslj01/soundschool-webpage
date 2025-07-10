import { CartItem } from "./types/cartItem";

const CART_KEY = "cartItems";

// Get all cart items
export function getCartItems() {
  const cartItems = localStorage.getItem(CART_KEY);
  return cartItems ? JSON.parse(cartItems) : [];
}

// Add an item to the cart
// TODO: Check if item already exists in cart before adding it
export function addToCart(item: CartItem) {
  const cartItems = getCartItems();
  cartItems.push(item);
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

// Remove an item from the cart
export function removeFromCart(id: string) { // removes based on the id of the cartitem
  const cartItems = getCartItems();
  const updatedItems = cartItems.filter((i: CartItem) => i.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
}
