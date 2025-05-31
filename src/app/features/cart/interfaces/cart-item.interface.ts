export interface CartItem {
  id: number ;
  productId: number | undefined;
  quantity: number;
  price: number;
  name: string;
}
