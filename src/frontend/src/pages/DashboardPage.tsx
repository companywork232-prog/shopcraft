import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  DollarSign,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import {
  useGetFinancialSummary,
  useListContacts,
  useListDeals,
  useListInvoices,
  useListProducts,
} from "../hooks/use-backend";
import { formatCurrency, formatDate } from "../types";

function KpiCard({
  title,
  value,
  sub,
  icon,
  color,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card
      className="shadow-subtle hover:shadow-elevated transition-smooth"
      data-ocid={`dashboard.kpi.${title.toLowerCase().replace(/\s+/g, "_")}.card`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {title}
            </p>
            <p className="font-display font-bold text-2xl text-foreground leading-none">
              {value}
            </p>
            {sub && (
              <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
            )}
          </div>
          <div
            className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simple inline SVG bar chart — no external lib needed
function BarChart({
  bars,
  height = 80,
}: {
  bars: { label: string; value: number; color?: string }[];
  height?: number;
}) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div className="flex items-end gap-1.5 w-full" style={{ height }}>
      {bars.map((bar) => {
        const pct = max > 0 ? (bar.value / max) * 100 : 0;
        return (
          <div
            key={bar.label}
            className="flex-1 flex flex-col items-center gap-1 min-w-0"
          >
            <div
              className="w-full rounded-t-sm transition-all duration-500"
              style={{
                height: `${pct}%`,
                minHeight: bar.value > 0 ? 4 : 0,
                background: bar.color ?? "var(--color-primary)",
                opacity: 0.85,
              }}
            />
            <span
              className="text-[10px] text-muted-foreground truncate w-full text-center"
              title={bar.label}
            >
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading: summaryLoading } = useGetFinancialSummary();
  const { data: contacts = [], isLoading: contactsLoading } = useListContacts();
  const { data: deals = [], isLoading: dealsLoading } = useListDeals();
  const { data: products = [], isLoading: productsLoading } = useListProducts();
  const { data: invoices = [], isLoading: invoicesLoading } = useListInvoices();

  const openDeals = deals.filter(
    (d) => !["closed_won", "closed_lost"].includes(d.stage),
  );
  const recentInvoices = [...invoices]
    .sort((a, b) => Number(b.issuedAt - a.issuedAt))
    .slice(0, 5);
  const lowStock = products
    .filter((p) => p.stockQuantity <= p.reorderThreshold)
    .slice(0, 5);

  const isLoading =
    summaryLoading ||
    contactsLoading ||
    dealsLoading ||
    productsLoading ||
    invoicesLoading;

  // Build deal-stage distribution bars
  const STAGE_LABELS: Record<string, string> = {
    prospect: "Prospect",
    discovery: "Discovery",
    proposal: "Proposal",
    negotiation: "Negotiation",
    closed_won: "Won",
    closed_lost: "Lost",
  };
  const STAGE_COLORS: Record<string, string> = {
    prospect: "var(--color-primary)",
    discovery: "var(--color-accent)",
    proposal: "var(--color-chart-3)",
    negotiation: "oklch(0.72 0.16 60)",
    closed_won: "var(--color-chart-2)",
    closed_lost: "var(--color-destructive)",
  };
  const dealStageBars = (
    [
      "prospect",
      "discovery",
      "proposal",
      "negotiation",
      "closed_won",
      "closed_lost",
    ] as const
  ).map((stage) => ({
    label: STAGE_LABELS[stage],
    value: deals.filter((d) => d.stage === stage).length,
    color: STAGE_COLORS[stage],
  }));

  // Revenue trend: bucket paid invoices by month (last 6 months)
  const revenueBars = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString("en-US", { month: "short" });
      const monthInvoices = invoices.filter((inv) => {
        if (inv.status !== "paid") return false;
        const ms = Number(inv.issuedAt / 1_000_000n);
        const id = new Date(ms);
        return (
          id.getFullYear() === d.getFullYear() && id.getMonth() === d.getMonth()
        );
      });
      const value = monthInvoices.reduce(
        (s, inv) =>
          s +
          Number(
            inv.lineItems.reduce(
              (ls, li) => ls + li.quantity * li.unitPrice,
              0n,
            ),
          ),
        0,
      );
      return { label, value };
    });
  })();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" data-ocid="dashboard.page">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Business overview —{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }, (_, i) => `kpi-skel-${i}`).map((k) => (
            <Skeleton key={k} className="h-24 rounded-xl" />
          ))
        ) : (
          <>
            <KpiCard
              title="Total Revenue"
              value={summary ? formatCurrency(summary.totalRevenue) : "$0"}
              sub={`Inventory: ${summary ? formatCurrency(summary.inventoryValue) : "$0"}`}
              icon={<DollarSign className="size-5 text-white" />}
              color="gradient-primary"
            />
            <KpiCard
              title="Contacts"
              value={contacts.length.toLocaleString()}
              sub={`${contacts.filter((c) => c.status === "customer").length} customers`}
              icon={<Users className="size-5 text-white" />}
              color="gradient-success"
            />
            <KpiCard
              title="Open Deals"
              value={openDeals.length.toLocaleString()}
              sub={`${formatCurrency(openDeals.reduce((s, d) => s + d.value, 0n))} pipeline`}
              icon={<Briefcase className="size-5 text-white" />}
              color="bg-amber-400 text-white"
            />
            <KpiCard
              title="Receivables"
              value={
                summary ? formatCurrency(summary.outstandingReceivables) : "$0"
              }
              sub={`${invoices.filter((i) => i.status === "overdue").length} overdue`}
              icon={<TrendingUp className="size-5 text-white" />}
              color="bg-orange-500 text-white"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card
          className="shadow-subtle"
          data-ocid="dashboard.revenue_chart.card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              Revenue Trend — Last 6 Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoicesLoading ? (
              <Skeleton className="h-24 w-full rounded-lg" />
            ) : (
              <BarChart bars={revenueBars} height={88} />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-subtle" data-ocid="dashboard.deals_chart.card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <Briefcase className="size-4 text-muted-foreground" />
              Deals by Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dealsLoading ? (
              <Skeleton className="h-24 w-full rounded-lg" />
            ) : (
              <BarChart bars={dealStageBars} height={88} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="shadow-subtle" data-ocid="dashboard.invoices.card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" />
              Recent Invoices
            </CardTitle>
            <button
              type="button"
              onClick={() => navigate({ to: "/erp/invoices" })}
              className="text-xs text-primary hover:underline flex items-center gap-1"
              data-ocid="dashboard.invoices.view_all.link"
            >
              View all <ArrowUpRight className="size-3" />
            </button>
          </CardHeader>
          <CardContent className="p-0">
            {invoicesLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : recentInvoices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No invoices yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((inv, i) => (
                    <TableRow
                      key={inv.id.toString()}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => navigate({ to: "/erp/invoices" })}
                      data-ocid={`dashboard.invoice.item.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(inv.issuedAt)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm">
                        {formatCurrency(
                          inv.lineItems.reduce(
                            (s, li) => s + li.quantity * li.unitPrice,
                            0n,
                          ),
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge type="invoice" value={inv.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="shadow-subtle" data-ocid="dashboard.low_stock.card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              Low Stock Alert
            </CardTitle>
            <button
              type="button"
              onClick={() => navigate({ to: "/erp/products" })}
              className="text-xs text-primary hover:underline flex items-center gap-1"
              data-ocid="dashboard.low_stock.view_all.link"
            >
              View all <ArrowUpRight className="size-3" />
            </button>
          </CardHeader>
          <CardContent className="p-0">
            {productsLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                All products adequately stocked
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Threshold</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStock.map((p, i) => (
                    <TableRow
                      key={p.id.toString()}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => navigate({ to: "/erp/products" })}
                      data-ocid={`dashboard.low_stock.item.${i + 1}`}
                    >
                      <TableCell className="font-medium text-sm truncate max-w-[140px]">
                        {p.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {p.sku}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="destructive"
                          className="font-mono text-xs"
                        >
                          {p.stockQuantity.toString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {p.reorderThreshold.toString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pipeline overview */}
      <Card className="shadow-subtle" data-ocid="dashboard.pipeline.card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
            <Briefcase className="size-4 text-muted-foreground" />
            Sales Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dealsLoading ? (
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="flex-1 h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(
                [
                  "prospect",
                  "discovery",
                  "proposal",
                  "negotiation",
                  "closed_won",
                  "closed_lost",
                ] as const
              ).map((stage) => {
                const stageDeals = deals.filter((d) => d.stage === stage);
                const total = stageDeals.reduce((s, d) => s + d.value, 0n);
                const labels: Record<string, string> = {
                  prospect: "Prospect",
                  discovery: "Discovery",
                  proposal: "Proposal",
                  negotiation: "Negotiation",
                  closed_won: "Won",
                  closed_lost: "Lost",
                };
                const isWon = stage === "closed_won";
                const isLost = stage === "closed_lost";
                return (
                  <button
                    type="button"
                    key={stage}
                    className={`w-full text-left rounded-xl p-3 border cursor-pointer hover:shadow-subtle transition-smooth ${isWon ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40" : isLost ? "bg-destructive/5 border-destructive/20" : "bg-muted/50 border-border"}`}
                    onClick={() => navigate({ to: "/crm/deals" })}
                    onKeyDown={(e) =>
                      e.key === "Enter" && navigate({ to: "/crm/deals" })
                    }
                    data-ocid={`dashboard.pipeline.${stage}.card`}
                  >
                    <p className="text-xs font-medium text-muted-foreground truncate mb-1">
                      {labels[stage]}
                    </p>
                    <p className="font-display font-bold text-xl text-foreground">
                      {stageDeals.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatCurrency(total)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
