import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  ClipboardList,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { formatPrice } from "../components/ProductCard";
import { useAuth } from "../hooks/use-auth";
import {
  useAdminListOrders,
  useIsAdmin,
  useListProducts,
} from "../hooks/use-backend";

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  sub?: string;
  loading?: boolean;
}) {
  return (
    <Card className="p-6 flex flex-col gap-4 bg-card border-border shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="size-5 text-primary" />
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-28" />
      ) : (
        <div>
          <p className="text-3xl font-display font-bold text-foreground">
            {value}
          </p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
      )}
    </Card>
  );
}

export default function AdminPage() {
  const { isAuthenticated, principal } = useAuth();
  const principalStr = principal?.toText();

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin(principalStr);
  const { data: productData, isLoading: prodLoading } = useListProducts({
    pageSize: 100,
  });
  const { data: orders = [], isLoading: ordersLoading } = useAdminListOrders(
    0,
    100,
  );

  const totalProducts = productData?.total ?? 0n;
  const totalOrders = BigInt(orders.length);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0n);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const recentOrders = [...orders]
    .sort((a, b) => Number(b.createdAt - a.createdAt))
    .slice(0, 5);

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8"
        data-ocid="admin.error_state"
      >
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="size-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Sign In Required
          </h2>
          <p className="text-muted-foreground mt-2">
            Please log in to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (isAdminLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="admin.loading_state"
      >
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8"
        data-ocid="admin.error_state"
      >
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="size-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You don&apos;t have admin privileges. Contact an administrator if
            you believe this is an error.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/" data-ocid="admin.link">
            Back to Store
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      data-ocid="admin.page"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground ml-12">
          Overview of your store&apos;s performance and quick actions.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10"
        data-ocid="admin.section"
      >
        <StatCard
          label="Total Products"
          value={String(totalProducts)}
          icon={Package}
          sub="active listings"
          loading={prodLoading}
        />
        <StatCard
          label="Total Orders"
          value={String(totalOrders)}
          icon={ShoppingBag}
          sub={`${pendingOrders} pending`}
          loading={ordersLoading}
        />
        <StatCard
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon={DollarSign}
          sub="all time"
          loading={ordersLoading}
        />
        <StatCard
          label="Sold Items"
          value={orders
            .reduce(
              (sum, o) =>
                sum + o.items.reduce((s, i) => s + Number(i.quantity), 0),
              0,
            )
            .toString()}
          icon={TrendingUp}
          sub="units sold"
          loading={ordersLoading}
        />
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        <Link to="/admin/products" data-ocid="admin.link">
          <Card className="p-6 flex items-center justify-between group hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  Manage Products
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and remove products
                </p>
              </div>
            </div>
            <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
          </Card>
        </Link>

        <Link to="/admin/orders" data-ocid="admin.link">
          <Card className="p-6 flex items-center justify-between group hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer bg-card border-border">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <ClipboardList className="size-6 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  Manage Orders
                </h3>
                <p className="text-sm text-muted-foreground">
                  View and update order statuses
                </p>
              </div>
            </div>
            <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      <div data-ocid="admin.section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Recent Orders
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/orders" data-ocid="admin.link">
              View all <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {ordersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <Card
            className="p-8 text-center text-muted-foreground"
            data-ocid="admin.empty_state"
          >
            No orders yet.
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
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr
                      key={order.id.toString()}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`admin.recent_orders.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{order.id.toString().padStart(6, "0")}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {order.items.reduce(
                          (s, i) => s + Number(i.quantity),
                          0,
                        )}{" "}
                        items
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(
                          Number(order.createdAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
