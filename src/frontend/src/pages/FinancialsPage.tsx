import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, DollarSign, Package, TrendingUp } from "lucide-react";
import { PageLoader } from "../components/LoadingSpinner";
import { PageHeader } from "../components/PageHeader";
import {
  useGetFinancialSummary,
  useListInvoices,
  useListProducts,
} from "../hooks/use-backend";
import { InvoiceStatus, formatCurrency } from "../types";

function MetricCard({
  title,
  value,
  icon,
  sub,
  accent,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Card className="shadow-subtle">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div
            className={`size-10 rounded-xl flex items-center justify-center ${accent}`}
          >
            {icon}
          </div>
        </div>
        <p className="font-display font-bold text-3xl text-foreground">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function FinancialsPage() {
  const { data: summary, isLoading: summaryLoading } = useGetFinancialSummary();
  const { data: invoices = [], isLoading: invoicesLoading } = useListInvoices();
  const { data: products = [], isLoading: productsLoading } = useListProducts();

  const isLoading = summaryLoading || invoicesLoading || productsLoading;

  const paidInvoices = invoices.filter((i) => i.status === InvoiceStatus.paid);
  const overdueInvoices = invoices.filter(
    (i) => i.status === InvoiceStatus.overdue,
  );
  const draftInvoices = invoices.filter(
    (i) => i.status === InvoiceStatus.draft || i.status === InvoiceStatus.sent,
  );

  const totalPaidAmount = paidInvoices.reduce(
    (s, inv) =>
      s + inv.lineItems.reduce((is, li) => is + li.quantity * li.unitPrice, 0n),
    0n,
  );
  const totalOverdueAmount = overdueInvoices.reduce(
    (s, inv) =>
      s + inv.lineItems.reduce((is, li) => is + li.quantity * li.unitPrice, 0n),
    0n,
  );

  const productsByCategory = products.reduce<
    Record<string, { count: number; value: bigint }>
  >((acc, p) => {
    const cat = p.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = { count: 0, value: 0n };
    acc[cat].count += 1;
    acc[cat].value += p.stockQuantity * p.sellingPrice;
    return acc;
  }, {});

  if (isLoading) return <PageLoader label="Loading financials…" />;

  return (
    <div
      className="p-6 max-w-6xl mx-auto space-y-6"
      data-ocid="financials.page"
    >
      <PageHeader
        title="Financials"
        description="Revenue, receivables, and inventory summary"
      />

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={summary ? formatCurrency(summary.totalRevenue) : "$0"}
          icon={<DollarSign className="size-5 text-white" />}
          accent="gradient-primary"
          sub={`${paidInvoices.length} paid invoices`}
        />
        <MetricCard
          title="Collected (Paid)"
          value={formatCurrency(totalPaidAmount)}
          icon={<TrendingUp className="size-5 text-white" />}
          accent="gradient-success"
          sub={`${paidInvoices.length} invoices`}
        />
        <MetricCard
          title="Outstanding"
          value={
            summary ? formatCurrency(summary.outstandingReceivables) : "$0"
          }
          icon={<BarChart3 className="size-5 text-white" />}
          accent="bg-amber-400"
          sub={`${draftInvoices.length} pending invoices`}
        />
        <MetricCard
          title="Overdue"
          value={formatCurrency(totalOverdueAmount)}
          icon={<DollarSign className="size-5 text-white" />}
          accent="bg-orange-500"
          sub={`${overdueInvoices.length} overdue invoices`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Value by Category */}
        <Card className="shadow-subtle" data-ocid="financials.inventory.card">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              Inventory Value by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(productsByCategory).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No products in inventory
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(productsByCategory)
                  .sort(([, a], [, b]) => Number(b.value - a.value))
                  .map(([cat, data]) => {
                    const total = Object.values(productsByCategory).reduce(
                      (s, d) => s + d.value,
                      0n,
                    );
                    const pct =
                      total > 0n ? Number((data.value * 100n) / total) : 0;
                    return (
                      <div
                        key={cat}
                        data-ocid={`financials.category.${cat.toLowerCase()}.row`}
                      >
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-foreground">
                            {cat}
                          </span>
                          <span className="text-muted-foreground">
                            {formatCurrency(data.value)}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full gradient-primary transition-smooth"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {data.count} products · {pct.toFixed(1)}% of inventory
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Status Breakdown */}
        <Card
          className="shadow-subtle"
          data-ocid="financials.invoice_breakdown.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground" />
              Invoice Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  status: "paid",
                  label: "Paid",
                  count: paidInvoices.length,
                  amount: totalPaidAmount,
                  color: "bg-emerald-500",
                },
                {
                  status: "sent",
                  label: "Sent",
                  count: invoices.filter((i) => i.status === "sent").length,
                  amount: invoices
                    .filter((i) => i.status === "sent")
                    .reduce(
                      (s, inv) =>
                        s +
                        inv.lineItems.reduce(
                          (is, li) => is + li.quantity * li.unitPrice,
                          0n,
                        ),
                      0n,
                    ),
                  color: "bg-primary",
                },
                {
                  status: "overdue",
                  label: "Overdue",
                  count: overdueInvoices.length,
                  amount: totalOverdueAmount,
                  color: "bg-destructive",
                },
                {
                  status: "draft",
                  label: "Draft",
                  count: invoices.filter((i) => i.status === "draft").length,
                  amount: invoices
                    .filter((i) => i.status === "draft")
                    .reduce(
                      (s, inv) =>
                        s +
                        inv.lineItems.reduce(
                          (is, li) => is + li.quantity * li.unitPrice,
                          0n,
                        ),
                      0n,
                    ),
                  color: "bg-muted-foreground",
                },
              ].map(({ status, label, count, amount, color }) => (
                <div
                  key={status}
                  className="flex items-center gap-3"
                  data-ocid={`financials.invoice_status.${status}.row`}
                >
                  <div className={`size-2.5 rounded-full shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} invoices
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Total Inventory Value
                </span>
                <span className="font-display font-bold text-lg text-foreground">
                  {summary ? formatCurrency(summary.inventoryValue) : "$0"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
