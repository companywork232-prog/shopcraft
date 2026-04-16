import { I as InvoiceStatus, j as jsxRuntimeExports, o as ChartColumn, P as Package } from "./index-BhbW23l5.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-sXXIs-lD.js";
import { P as PageLoader } from "./LoadingSpinner-BKeIT-Ei.js";
import { P as PageHeader } from "./PageHeader-DNDU9EDp.js";
import { u as useGetFinancialSummary, d as useListInvoices, c as useListProducts } from "./use-backend-BSO58jnW.js";
import { f as formatCurrency } from "./index-BZSQpLYM.js";
import { D as DollarSign, T as TrendingUp } from "./trending-up-CCt78KGE.js";
function MetricCard({
  title,
  value,
  icon,
  sub,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `size-10 rounded-xl flex items-center justify-center ${accent}`,
          children: icon
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-3xl text-foreground", children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: sub })
  ] }) });
}
function FinancialsPage() {
  const { data: summary, isLoading: summaryLoading } = useGetFinancialSummary();
  const { data: invoices = [], isLoading: invoicesLoading } = useListInvoices();
  const { data: products = [], isLoading: productsLoading } = useListProducts();
  const isLoading = summaryLoading || invoicesLoading || productsLoading;
  const paidInvoices = invoices.filter((i) => i.status === InvoiceStatus.paid);
  const overdueInvoices = invoices.filter(
    (i) => i.status === InvoiceStatus.overdue
  );
  const draftInvoices = invoices.filter(
    (i) => i.status === InvoiceStatus.draft || i.status === InvoiceStatus.sent
  );
  const totalPaidAmount = paidInvoices.reduce(
    (s, inv) => s + inv.lineItems.reduce((is, li) => is + li.quantity * li.unitPrice, 0n),
    0n
  );
  const totalOverdueAmount = overdueInvoices.reduce(
    (s, inv) => s + inv.lineItems.reduce((is, li) => is + li.quantity * li.unitPrice, 0n),
    0n
  );
  const productsByCategory = products.reduce((acc, p) => {
    const cat = p.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = { count: 0, value: 0n };
    acc[cat].count += 1;
    acc[cat].value += p.stockQuantity * p.sellingPrice;
    return acc;
  }, {});
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, { label: "Loading financials…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 max-w-6xl mx-auto space-y-6",
      "data-ocid": "financials.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PageHeader,
          {
            title: "Financials",
            description: "Revenue, receivables, and inventory summary"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Total Revenue",
              value: summary ? formatCurrency(summary.totalRevenue) : "$0",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "size-5 text-white" }),
              accent: "gradient-primary",
              sub: `${paidInvoices.length} paid invoices`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Collected (Paid)",
              value: formatCurrency(totalPaidAmount),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-5 text-white" }),
              accent: "gradient-success",
              sub: `${paidInvoices.length} invoices`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Outstanding",
              value: summary ? formatCurrency(summary.outstandingReceivables) : "$0",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-5 text-white" }),
              accent: "bg-amber-400",
              sub: `${draftInvoices.length} pending invoices`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricCard,
            {
              title: "Overdue",
              value: formatCurrency(totalOverdueAmount),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "size-5 text-white" }),
              accent: "bg-orange-500",
              sub: `${overdueInvoices.length} overdue invoices`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", "data-ocid": "financials.inventory.card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-4 text-muted-foreground" }),
              "Inventory Value by Category"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: Object.keys(productsByCategory).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No products in inventory" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Object.entries(productsByCategory).sort(([, a], [, b]) => Number(b.value - a.value)).map(([cat, data]) => {
              const total = Object.values(productsByCategory).reduce(
                (s, d) => s + d.value,
                0n
              );
              const pct = total > 0n ? Number(data.value * 100n / total) : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `financials.category.${cat.toLowerCase()}.row`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: cat }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: formatCurrency(data.value) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full rounded-full gradient-primary transition-smooth",
                        style: { width: `${pct}%` }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                      data.count,
                      " products · ",
                      pct.toFixed(1),
                      "% of inventory"
                    ] })
                  ]
                },
                cat
              );
            }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "shadow-subtle",
              "data-ocid": "financials.invoice_breakdown.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "size-4 text-muted-foreground" }),
                  "Invoice Status Breakdown"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [
                    {
                      status: "paid",
                      label: "Paid",
                      count: paidInvoices.length,
                      amount: totalPaidAmount,
                      color: "bg-emerald-500"
                    },
                    {
                      status: "sent",
                      label: "Sent",
                      count: invoices.filter((i) => i.status === "sent").length,
                      amount: invoices.filter((i) => i.status === "sent").reduce(
                        (s, inv) => s + inv.lineItems.reduce(
                          (is, li) => is + li.quantity * li.unitPrice,
                          0n
                        ),
                        0n
                      ),
                      color: "bg-primary"
                    },
                    {
                      status: "overdue",
                      label: "Overdue",
                      count: overdueInvoices.length,
                      amount: totalOverdueAmount,
                      color: "bg-destructive"
                    },
                    {
                      status: "draft",
                      label: "Draft",
                      count: invoices.filter((i) => i.status === "draft").length,
                      amount: invoices.filter((i) => i.status === "draft").reduce(
                        (s, inv) => s + inv.lineItems.reduce(
                          (is, li) => is + li.quantity * li.unitPrice,
                          0n
                        ),
                        0n
                      ),
                      color: "bg-muted-foreground"
                    }
                  ].map(({ status, label, count, amount, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-3",
                      "data-ocid": `financials.invoice_status.${status}.row`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-2.5 rounded-full shrink-0 ${color}` }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: label }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                              count,
                              " invoices"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatCurrency(amount) })
                        ] })
                      ]
                    },
                    status
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 pt-4 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Total Inventory Value" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-lg text-foreground", children: summary ? formatCurrency(summary.inventoryValue) : "$0" })
                  ] }) })
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  FinancialsPage as default
};
