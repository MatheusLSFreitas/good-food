export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "paid" | "preparing" | "ready";

export interface Order {
  id: string;
  dbId?: number;
  number: string;
  customerName?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}
