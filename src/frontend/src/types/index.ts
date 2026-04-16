import type {
  CartItem,
  Order,
  OrderStatus,
  Product,
  ShippingAddress,
} from "../backend";

export type { Product, Order, CartItem, ShippingAddress, OrderStatus };

export interface CartEntry {
  productId: bigint;
  quantity: number;
  product?: Product;
}

export interface LocalCart {
  items: CartEntry[];
}

export type SortOption = "newest" | "priceAsc" | "priceDesc" | "bestSelling";

export interface FilterState {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search: string;
  sortBy: SortOption;
}

export const CATEGORIES = [
  "Headphones",
  "Smartwatches",
  "Speakers",
  "Keyboards",
  "Monitors",
  "Accessories",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
