import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreateOrderArgs {
    paymentIntent: string;
    shippingAddress: ShippingAddress;
}
export interface ProductInput {
    title: string;
    description: string;
    category: string;
    inventoryCount: bigint;
    price: bigint;
    images: Array<string>;
}
export type Timestamp = bigint;
export interface ShippingAddress {
    zip: string;
    street: string;
    country: string;
    city: string;
    name: string;
    state: string;
}
export interface OrderItem {
    title: string;
    productId: ProductId;
    quantity: bigint;
    price: bigint;
}
export interface ListProductsArgs {
    sortBy: SortOption;
    page: bigint;
    pageSize: bigint;
    search?: string;
    maxPrice?: bigint;
    category?: string;
    minPrice?: bigint;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    total: bigint;
    userId: UserId;
    createdAt: Timestamp;
    paymentIntent: string;
    shippingAddress: ShippingAddress;
    items: Array<OrderItem>;
}
export type UserId = Principal;
export interface Wishlist {
    productIds: Array<ProductId>;
    userId: UserId;
}
export interface Cart {
    userId: UserId;
    items: Array<CartItem>;
}
export type ProductId = bigint;
export interface CartItem {
    productId: ProductId;
    quantity: bigint;
}
export interface PageResult {
    total: bigint;
    page: bigint;
    pageSize: bigint;
    items: Array<Product>;
}
export interface Product {
    id: ProductId;
    title: string;
    createdAt: Timestamp;
    description: string;
    category: string;
    inventoryCount: bigint;
    price: bigint;
    soldCount: bigint;
    images: Array<string>;
}
export type OrderId = bigint;
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    paid = "paid",
    delivered = "delivered"
}
export enum SortOption {
    bestSelling = "bestSelling",
    newest = "newest",
    priceDesc = "priceDesc",
    priceAsc = "priceAsc"
}
export interface backendInterface {
    addAdmin(newAdmin: UserId): Promise<void>;
    addToCart(productId: ProductId, quantity: bigint): Promise<void>;
    addToWishlist(productId: ProductId): Promise<void>;
    adminListOrders(page: bigint, pageSize: bigint): Promise<Array<Order>>;
    adminUpdateOrderStatus(id: OrderId, status: OrderStatus): Promise<Order | null>;
    clearCart(): Promise<void>;
    createOrder(args: CreateOrderArgs): Promise<Order>;
    createProduct(input: ProductInput): Promise<Product>;
    deleteProduct(id: ProductId): Promise<boolean>;
    getCart(): Promise<Cart>;
    getMyOrders(): Promise<Array<Order>>;
    getOrder(id: OrderId): Promise<Order | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getWishlist(): Promise<Wishlist>;
    initializeAdmin(): Promise<void>;
    isAdmin(who: UserId): Promise<boolean>;
    listProducts(args: ListProductsArgs): Promise<PageResult>;
    removeAdmin(target: UserId): Promise<void>;
    removeFromCart(productId: ProductId): Promise<void>;
    removeFromWishlist(productId: ProductId): Promise<void>;
    searchProducts(term: string, page: bigint, pageSize: bigint): Promise<PageResult>;
    updateCartQuantity(productId: ProductId, quantity: bigint): Promise<void>;
    updateProduct(id: ProductId, input: ProductInput): Promise<Product | null>;
}
