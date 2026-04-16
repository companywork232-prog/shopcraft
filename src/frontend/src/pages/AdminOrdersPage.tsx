import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { formatPrice } from "../components/ProductCard";
import { useAuth } from "../hooks/use-auth";
import {
  OrderStatus,
  useAdminListOrders,
  useAdminUpdateOrderStatus,
  useIsAdmin,
} from "../hooks/use-backend";
import { ORDER_STATUS_LABELS } from "../types";

const PAGE_SIZE = 20;

function truncatePrincipal(p: string): string {
  if (p.length <= 14) return p;
  return `${p.slice(0, 6)}…${p.slice(-5)}`;
}

export default function AdminOrdersPage() {
  const { isAuthenticated, principal } = useAuth();
  const principalStr = principal?.toText();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin(principalStr);

  const [page, setPage] = useState(0);
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const {
    data: orders = [],
    isLoading,
    refetch,
    isFetching,
  } = useAdminListOrders(page, PAGE_SIZE);
  const updateStatus = useAdminUpdateOrderStatus();

  const handleStatusChange = async (orderId: bigint, status: string) => {
    setUpdatingId(orderId);
    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status: status as OrderStatus,
      });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const sortedOrders = [...orders].sort((a, b) =>
    Number(b.createdAt - a.createdAt),
  );

  if (!isAuthenticated || (!isAdminLoading && !isAdmin)) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8"
        data-ocid="admin_orders.error_state"
      >
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="size-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You don&apos;t have admin privileges to access this page.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Back to Store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      data-ocid="admin_orders.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link to="/admin" data-ocid="admin_orders.link">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <ClipboardList className="size-5 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Orders
              </h1>
              <p className="text-sm text-muted-foreground">
                {orders.length} orders on this page
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          data-ocid="admin_orders.secondary_button"
        >
          <RefreshCw
            className={`size-3.5 mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="admin_orders.loading_state">
          {Array.from({ length: 8 }, (_, i) => `skel-${i}`).map((k) => (
            <Skeleton key={k} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : sortedOrders.length === 0 ? (
        <Card
          className="p-16 flex flex-col items-center gap-4 text-center"
          data-ocid="admin_orders.empty_state"
        >
          <div className="size-14 rounded-full bg-muted flex items-center justify-center">
            <ClipboardList className="size-7 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              No orders yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Orders will appear here once customers start purchasing.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Items
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Update Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order, idx) => {
                  const isUpdating = updatingId === order.id;
                  const itemCount = order.items.reduce(
                    (s, i) => s + Number(i.quantity),
                    0,
                  );
                  const principalText = order.userId.toText();

                  return (
                    <tr
                      key={order.id.toString()}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`admin_orders.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{order.id.toString().padStart(6, "0")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-mono text-xs text-foreground bg-muted/50 px-2 py-0.5 rounded"
                          title={principalText}
                        >
                          {truncatePrincipal(principalText)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-foreground">
                        {itemCount}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground tabular-nums">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(
                          Number(order.createdAt) / 1_000_000,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={order.status}
                          onValueChange={(v) => handleStatusChange(order.id, v)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger
                            className="h-8 w-36 text-xs"
                            data-ocid={`admin_orders.select.${idx + 1}`}
                          >
                            {isUpdating ? (
                              <span className="flex items-center gap-1.5">
                                <RefreshCw className="size-3 animate-spin" />
                                Updating…
                              </span>
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.values(OrderStatus) as OrderStatus[]).map(
                              (s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="text-xs"
                                >
                                  {ORDER_STATUS_LABELS[s]}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {!isLoading && orders.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} · {orders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0 || isFetching}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              data-ocid="admin_orders.pagination_prev"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={orders.length < PAGE_SIZE || isFetching}
              onClick={() => setPage((p) => p + 1)}
              data-ocid="admin_orders.pagination_next"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
