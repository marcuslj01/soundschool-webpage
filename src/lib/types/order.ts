
import { OrderItem } from "./orderItem";

export interface Order {
  id: string;
  userId: string | null; // null for guest orders
  customer_email: string;
  customer_name: string;
  created_at: Date;
  total_price: number;
  orderItems: OrderItem[];
  status: "paid" | "refunded" | "pending" | "failed";
  payment_id: string;
  refunded: boolean;
  refund_reason?: string;
  // TODO: Add payment method details?
}