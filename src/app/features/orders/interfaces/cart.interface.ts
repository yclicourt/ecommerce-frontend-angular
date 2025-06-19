import { User } from "@features/auth/interfaces/register.interface";
import { Order } from "@features/orders/interfaces/order.interface";
import { CartItem } from "./cart-item.interface";

export interface Cart {
  user: User;
  orders: Order;
  cartItems: CartItem;
  currency: string;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
}
