import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Package, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import type { Order } from "../backend.d";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { formatPrice } from "../components/ProductCard";
import { useAuth } from "../hooks/use-auth";
import { useGetMyOrders } from "../hooks/use-backend";

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function OrderSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-3/4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      data-ocid={`orders.item.${index + 1}`}
      className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4 hover:shadow-subtle transition-smooth"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-primary shrink-0" />
            <span className="font-display font-semibold text-foreground text-sm">
              Order #{order.id.toString()}
            </span>
          </div>
          <span className="text-xs text-muted-foreground pl-6">
            {formatDate(order.createdAt)}
          </span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Items summary */}
      {firstItem && (
        <div className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-3">
          <span className="font-medium text-foreground">{firstItem.title}</span>
          {firstItem.quantity > 1n && (
            <span className="text-muted-foreground">
              {" "}
              ×{firstItem.quantity.toString()}
            </span>
          )}
          {extraCount > 0 && (
            <span className="ml-1 text-muted-foreground">
              + {extraCount} more {extraCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="font-display font-bold text-foreground">
            {formatPrice(order.total)}
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-xs font-normal text-muted-foreground"
        >
          {order.items.length} {order.items.length === 1 ? "item" : "items"}
        </Badge>
      </div>
    </motion.div>
  );
}

function EmptyOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      data-ocid="orders.empty_state"
      className="flex flex-col items-center justify-center gap-6 py-20 px-8 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <ClipboardList className="size-9 text-primary" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-xl font-semibold text-foreground">
          No orders yet
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          When you place your first order, it will appear here. Start shopping
          to get started!
        </p>
      </div>
      <Button asChild data-ocid="orders.shop_button">
        <Link to="/catalog">
          <ShoppingBag className="size-4 mr-2" />
          Browse Products
        </Link>
      </Button>
    </motion.div>
  );
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { data: orders, isLoading } = useGetMyOrders();

  // Redirect unauthenticated users
  if (!authLoading && !isAuthenticated) {
    return (
      <div
        data-ocid="orders.login_prompt"
        className="flex flex-col items-center justify-center gap-6 min-h-[60vh] px-8 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <ClipboardList className="size-9 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Sign in to view your orders
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Your order history is private. Please sign in with Internet Identity
            to continue.
          </p>
        </div>
        <Button onClick={login} data-ocid="orders.login_button">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-foreground">
          My Orders
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Track and review your purchase history
        </p>
      </motion.div>

      {/* Loading */}
      {(isLoading || authLoading) && (
        <div data-ocid="orders.loading_state" className="flex flex-col gap-4">
          {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map((k) => (
            <OrderSkeleton key={k} />
          ))}
        </div>
      )}

      {/* Orders list */}
      {!isLoading && !authLoading && orders && orders.length > 0 && (
        <div data-ocid="orders.list" className="flex flex-col gap-4">
          {orders.map((order, i) => (
            <OrderCard key={order.id.toString()} order={order} index={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !authLoading && (!orders || orders.length === 0) && (
        <EmptyOrders />
      )}
    </div>
  );
}
