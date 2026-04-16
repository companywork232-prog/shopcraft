import type { backendInterface, Product, Cart, Wishlist, Order, PageResult } from "../backend";
import { OrderStatus, SortOption } from "../backend";

const sampleProducts: Product[] = [
  {
    id: BigInt(0),
    title: "Classic White T-Shirt",
    description: "A premium 100% cotton white t-shirt. Comfortable everyday wear with a relaxed fit.",
    price: BigInt(2999),
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"],
    category: "Clothing",
    inventoryCount: BigInt(100),
    soldCount: BigInt(42),
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(1),
    title: "Slim Fit Chinos",
    description: "Modern slim-fit chino trousers in a versatile khaki colour. Perfect for casual and smart-casual occasions.",
    price: BigInt(5999),
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600"],
    category: "Clothing",
    inventoryCount: BigInt(60),
    soldCount: BigInt(18),
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(2),
    title: "Leather Sneakers",
    description: "Minimalist white leather sneakers with rubber sole. A wardrobe staple that goes with everything.",
    price: BigInt(8999),
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
    category: "Footwear",
    inventoryCount: BigInt(40),
    soldCount: BigInt(55),
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(3),
    title: "Canvas Tote Bag",
    description: "Durable canvas tote bag with reinforced handles. Ideal for shopping, the beach, or daily errands.",
    price: BigInt(1999),
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"],
    category: "Accessories",
    inventoryCount: BigInt(200),
    soldCount: BigInt(87),
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(4),
    title: "Stainless Steel Water Bottle",
    description: "Vacuum-insulated 500 ml stainless steel bottle. Keeps drinks cold for 24 hours and hot for 12 hours.",
    price: BigInt(3499),
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600"],
    category: "Accessories",
    inventoryCount: BigInt(150),
    soldCount: BigInt(33),
    createdAt: BigInt(Date.now()),
  },
];

export const mockBackend: backendInterface = {
  addAdmin: async () => undefined,
  addToCart: async () => undefined,
  addToWishlist: async () => undefined,
  adminListOrders: async () => [],
  adminUpdateOrderStatus: async () => null,
  clearCart: async () => undefined,
  createOrder: async (args) => ({
    id: BigInt(1),
    status: OrderStatus.pending,
    total: BigInt(2999),
    userId: {} as any,
    createdAt: BigInt(Date.now()),
    paymentIntent: args.paymentIntent,
    shippingAddress: args.shippingAddress,
    items: [],
  }),
  createProduct: async (input) => ({
    id: BigInt(99),
    title: input.title,
    description: input.description,
    price: input.price,
    images: input.images,
    category: input.category,
    inventoryCount: input.inventoryCount,
    soldCount: BigInt(0),
    createdAt: BigInt(Date.now()),
  }),
  deleteProduct: async () => true,
  getCart: async (): Promise<Cart> => ({
    userId: {} as any,
    items: [
      { productId: BigInt(0), quantity: BigInt(1) },
    ],
  }),
  getMyOrders: async (): Promise<Order[]> => [],
  getOrder: async () => null,
  getProduct: async (id) => sampleProducts.find(p => p.id === id) ?? null,
  getWishlist: async (): Promise<Wishlist> => ({
    userId: {} as any,
    productIds: [BigInt(2)],
  }),
  initializeAdmin: async () => undefined,
  isAdmin: async () => false,
  listProducts: async (args): Promise<PageResult> => ({
    total: BigInt(sampleProducts.length),
    page: args.page,
    pageSize: args.pageSize,
    items: sampleProducts,
  }),
  removeAdmin: async () => undefined,
  removeFromCart: async () => undefined,
  removeFromWishlist: async () => undefined,
  searchProducts: async (term, page, pageSize): Promise<PageResult> => {
    const filtered = sampleProducts.filter(p =>
      p.title.toLowerCase().includes(term.toLowerCase())
    );
    return { total: BigInt(filtered.length), page, pageSize, items: filtered };
  },
  updateCartQuantity: async () => undefined,
  updateProduct: async () => null,
};
