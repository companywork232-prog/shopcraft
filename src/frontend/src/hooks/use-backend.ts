import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { SortOption as BackendSortOption } from "../backend";
import { OrderStatus } from "../backend";
import type { Order, Product } from "../backend.d";

// ─── Re-export for convenience ──────────────────────────────────────────────
export { OrderStatus };
export type { Product, Order };

// ─── Shared actor hook ───────────────────────────────────────────────────────
function useBackendActor() {
  return useActor(createActor);
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useListProducts(args: {
  page?: number;
  pageSize?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: BackendSortOption;
  search?: string;
}) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["products", args],
    queryFn: async () => {
      if (!actor) return { items: [], total: 0n, page: 0n, pageSize: 12n };
      return actor.listProducts({
        page: BigInt(args.page ?? 0),
        pageSize: BigInt(args.pageSize ?? 12),
        sortBy: (args.sortBy ?? "newest") as BackendSortOption,
        category: args.category,
        minPrice:
          args.minPrice !== undefined ? BigInt(args.minPrice) : undefined,
        maxPrice:
          args.maxPrice !== undefined ? BigInt(args.maxPrice) : undefined,
        search: args.search,
      });
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetProduct(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 60_000,
  });
}

export function useSearchProducts(term: string, page = 0, pageSize = 12) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["search", term, page, pageSize],
    queryFn: async () => {
      if (!actor || !term)
        return { items: [], total: 0n, page: 0n, pageSize: BigInt(pageSize) };
      return actor.searchProducts(term, BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !isFetching && term.length > 0,
    staleTime: 15_000,
  });
}

export function useGetCart() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

export function useGetMyOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetWishlist() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWishlist();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin(principal: string | undefined) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["isAdmin", principal],
    queryFn: async () => {
      if (!actor || !principal) return false;
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.isAdmin(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching && !!principal,
    staleTime: 60_000,
  });
}

export function useAdminListOrders(page = 0, pageSize = 20) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["admin-orders", page, pageSize],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminListOrders(BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useAddToCart() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: bigint; quantity: number }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addToCart(productId, BigInt(quantity));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveFromCart() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.removeFromCart(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useClearCart() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.clearCart();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useCreateProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      description: string;
      category: string;
      inventoryCount: number;
      price: number;
      images: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProduct({
        ...input,
        inventoryCount: BigInt(input.inventoryCount),
        price: BigInt(input.price),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: bigint;
      input: {
        title: string;
        description: string;
        category: string;
        inventoryCount: number;
        price: number;
        images: string[];
      };
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(id, {
        ...input,
        inventoryCount: BigInt(input.inventoryCount),
        price: BigInt(input.price),
      });
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", v.id.toString()] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useCreateOrder() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      paymentIntent: string;
      shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createOrder(args);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useAdminUpdateOrderStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminUpdateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });
}

export function useAddToWishlist() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.addToWishlist(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveFromWishlist() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await actor.removeFromWishlist(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
