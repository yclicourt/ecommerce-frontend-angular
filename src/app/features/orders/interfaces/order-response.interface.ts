import { Order } from "./order.interface";

export interface OrderResponse {
  order: Order;
  approval_url: string;
  paypal_order_id: number;
}