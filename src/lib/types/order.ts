import { Timestamp } from "firebase/firestore";
import { OrderItem } from "./orderItem";

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  created_at: Timestamp;
  total_price: number;
  orderItems: OrderItem[];
  status: "paid" | "refunded" | "pending" | "failed";
  payment_id: string;
  refunded: boolean;
  refund_reason?: string;
  // TODO: Add payment method details?
}