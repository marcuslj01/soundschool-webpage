import { CartItem } from "./cartItem";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastLoginAt: Date;
  
  // E-commerce specific fields
  cartItems?: CartItem[]; // Array of cart items (for future use)
  preferences?: {
    newsletter?: boolean;
    marketing?: boolean;
  };
  favorites?: string[]; // Array of favorite product IDs (for future use)
} 