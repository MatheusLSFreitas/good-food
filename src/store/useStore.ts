import { create } from "zustand";
import { CartItem, Order, OrderStatus, Product } from "@/types/order";
import { products as defaultProducts } from "@/data/products";

interface AppStore {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, data: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;

  // Orders
  orders: Order[];
  nextOrderNumber: number;
  createOrder: (items: CartItem[], total: number, customerName?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Current completed order (for confirmation screen)
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  products: [...defaultProducts],

  addProduct: (data) =>
    set((state) => ({
      products: [...state.products, { ...data, id: crypto.randomUUID() }],
    })),

  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      cart: state.cart.filter((i) => i.product.id !== id),
    })),

  cart: [],

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.product.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((i) => i.product.id !== productId) };
      }
      return {
        cart: state.cart.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        ),
      };
    }),

  clearCart: () => set({ cart: [] }),

  cartTotal: () =>
    get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  orders: [],
  nextOrderNumber: 1,

  createOrder: (items, total) => {
    const num = get().nextOrderNumber;
    const order: Order = {
      id: crypto.randomUUID(),
      number: String(num).padStart(3, "0"),
      items,
      total,
      status: "paid",
      createdAt: new Date(),
    };
    set((state) => ({
      orders: [...state.orders, order],
      nextOrderNumber: state.nextOrderNumber + 1,
    }));
    return order;
  },

  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
    })),

  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),
}));
