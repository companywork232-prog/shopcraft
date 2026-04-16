import { c as createLucideIcon, u as useNavigate, j as jsxRuntimeExports, S as Skeleton, U as Users, B as Briefcase, A as Activity, P as Package } from "./index-BhbW23l5.js";
import { B as Badge } from "./badge-DanXJMsT.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-sXXIs-lD.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Bd3FKH5T.js";
import { S as StatusBadge } from "./StatusBadge-Baq1oYX3.js";
import { u as useGetFinancialSummary, a as useListContacts, b as useListDeals, c as useListProducts, d as useListInvoices } from "./use-backend-BSO58jnW.js";
import { f as formatCurrency, a as formatDate } from "./index-BZSQpLYM.js";
import { D as DollarSign, T as TrendingUp } from "./trending-up-CCt78KGE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode);
function KpiCard({
  title,
  value,
  sub,
  icon,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "shadow-subtle hover:shadow-elevated transition-smooth",
      "data-ocid": `dashboard.kpi.${title.toLowerCase().replace(/\s+/g, "_")}.card`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-2xl text-foreground leading-none", children: value }),
          sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: sub })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `size-10 rounded-xl flex items-center justify-center shrink-0 ${color}`,
            children: icon
          }
        )
      ] }) })
    }
  );
}
function BarChart({
  bars,
  height = 80
}) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1.5 w-full", style: { height }, children: bars.map((bar) => {
    const pct = max > 0 ? bar.value / max * 100 : 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center gap-1 min-w-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-full rounded-t-sm transition-all duration-500",
              style: {
                height: `${pct}%`,
                minHeight: bar.value > 0 ? 4 : 0,
                background: bar.color ?? "var(--color-primary)",
                opacity: 0.85
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] text-muted-foreground truncate w-full text-center",
              title: bar.label,
              children: bar.label
            }
          )
        ]
      },
      bar.label
    );
  }) });
}
function DashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading: summaryLoading } = useGetFinancialSummary();
  const { data: contacts = [], isLoading: contactsLoading } = useListContacts();
  const { data: deals = [], isLoading: dealsLoading } = useListDeals();
  const { data: products = [], isLoading: productsLoading } = useListProducts();
  const { data: invoices = [], isLoading: invoicesLoading } = useListInvoices();
  const openDeals = deals.filter(
    (d) => !["closed_won", "closed_lost"].includes(d.stage)
  );
  const recentInvoices = [...invoices].sort((a, b) => Number(b.issuedAt - a.issuedAt)).slice(0, 5);
  const lowStock = products.filter((p) => p.stockQuantity <= p.reorderThreshold).slice(0, 5);
  const isLoading = summaryLoading || contactsLoading || dealsLoading || productsLoading || invoicesLoading;
  const STAGE_LABELS = {
    prospect: "Prospect",
    discovery: "Discovery",
    proposal: "Proposal",
    negotiation: "Negotiation",
    closed_won: "Won",
    closed_lost: "Lost"
  };
  const STAGE_COLORS = {
    prospect: "var(--color-primary)",
    discovery: "var(--color-accent)",
    proposal: "var(--color-chart-3)",
    negotiation: "oklch(0.72 0.16 60)",
    closed_won: "var(--color-chart-2)",
    closed_lost: "var(--color-destructive)"
  };
  const dealStageBars = [
    "prospect",
    "discovery",
    "proposal",
    "negotiation",
    "closed_won",
    "closed_lost"
  ].map((stage) => ({
    label: STAGE_LABELS[stage],
    value: deals.filter((d) => d.stage === stage).length,
    color: STAGE_COLORS[stage]
  }));
  const revenueBars = (() => {
    const now = /* @__PURE__ */ new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString("en-US", { month: "short" });
      const monthInvoices = invoices.filter((inv) => {
        if (inv.status !== "paid") return false;
        const ms = Number(inv.issuedAt / 1000000n);
        const id = new Date(ms);
        return id.getFullYear() === d.getFullYear() && id.getMonth() === d.getMonth();
      });
      const value = monthInvoices.reduce(
        (s, inv) => s + Number(
          inv.lineItems.reduce(
            (ls, li) => ls + li.quantity * li.unitPrice,
            0n
          )
        ),
        0
      );
      return { label, value };
    });
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-7xl mx-auto space-y-6", "data-ocid": "dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
        "Business overview —",
        " ",
        (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4", children: isLoading ? Array.from({ length: 4 }, (_, i) => `kpi-skel-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, k)) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          title: "Total Revenue",
          value: summary ? formatCurrency(summary.totalRevenue) : "$0",
          sub: `Inventory: ${summary ? formatCurrency(summary.inventoryValue) : "$0"}`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "size-5 text-white" }),
          color: "gradient-primary"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          title: "Contacts",
          value: contacts.length.toLocaleString(),
          sub: `${contacts.filter((c) => c.status === "customer").length} customers`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5 text-white" }),
          color: "gradient-success"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          title: "Open Deals",
          value: openDeals.length.toLocaleString(),
          sub: `${formatCurrency(openDeals.reduce((s, d) => s + d.value, 0n))} pipeline`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-5 text-white" }),
          color: "bg-amber-400 text-white"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KpiCard,
        {
          title: "Receivables",
          value: summary ? formatCurrency(summary.outstandingReceivables) : "$0",
          sub: `${invoices.filter((i) => i.status === "overdue").length} overdue`,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-5 text-white" }),
          color: "bg-orange-500 text-white"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "shadow-subtle",
          "data-ocid": "dashboard.revenue_chart.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-muted-foreground" }),
              "Revenue Trend — Last 6 Months"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: invoicesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-lg" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart, { bars: revenueBars, height: 88 }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", "data-ocid": "dashboard.deals_chart.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4 text-muted-foreground" }),
          "Deals by Stage"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: dealsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-lg" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BarChart, { bars: dealStageBars, height: 88 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", "data-ocid": "dashboard.invoices.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4 text-muted-foreground" }),
            "Recent Invoices"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/erp/invoices" }),
              className: "text-xs text-primary hover:underline flex items-center gap-1",
              "data-ocid": "dashboard.invoices.view_all.link",
              children: [
                "View all ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: invoicesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, i)) }) : recentInvoices.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "No invoices yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Invoice #" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Issued" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: recentInvoices.map((inv, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: "cursor-pointer hover:bg-muted/40",
              onClick: () => navigate({ to: "/erp/invoices" }),
              "data-ocid": `dashboard.invoice.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: inv.invoiceNumber }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: formatDate(inv.issuedAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-medium text-sm", children: formatCurrency(
                  inv.lineItems.reduce(
                    (s, li) => s + li.quantity * li.unitPrice,
                    0n
                  )
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { type: "invoice", value: inv.status }) })
              ]
            },
            inv.id.toString()
          )) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", "data-ocid": "dashboard.low_stock.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-4 text-muted-foreground" }),
            "Low Stock Alert"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/erp/products" }),
              className: "text-xs text-primary hover:underline flex items-center gap-1",
              "data-ocid": "dashboard.low_stock.view_all.link",
              children: [
                "View all ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "size-3" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: productsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, i)) }) : lowStock.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "All products adequately stocked" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "SKU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Threshold" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: lowStock.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: "cursor-pointer hover:bg-muted/40",
              onClick: () => navigate({ to: "/erp/products" }),
              "data-ocid": `dashboard.low_stock.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm truncate max-w-[140px]", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: p.sku }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "destructive",
                    className: "font-mono text-xs",
                    children: p.stockQuantity.toString()
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-sm text-muted-foreground", children: p.reorderThreshold.toString() })
              ]
            },
            p.id.toString()
          )) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", "data-ocid": "dashboard.pipeline.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4 text-muted-foreground" }),
        "Sales Pipeline"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: dealsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "flex-1 h-24 rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3", children: [
        "prospect",
        "discovery",
        "proposal",
        "negotiation",
        "closed_won",
        "closed_lost"
      ].map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage);
        const total = stageDeals.reduce((s, d) => s + d.value, 0n);
        const labels = {
          prospect: "Prospect",
          discovery: "Discovery",
          proposal: "Proposal",
          negotiation: "Negotiation",
          closed_won: "Won",
          closed_lost: "Lost"
        };
        const isWon = stage === "closed_won";
        const isLost = stage === "closed_lost";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: `w-full text-left rounded-xl p-3 border cursor-pointer hover:shadow-subtle transition-smooth ${isWon ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/40" : isLost ? "bg-destructive/5 border-destructive/20" : "bg-muted/50 border-border"}`,
            onClick: () => navigate({ to: "/crm/deals" }),
            onKeyDown: (e) => e.key === "Enter" && navigate({ to: "/crm/deals" }),
            "data-ocid": `dashboard.pipeline.${stage}.card`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground truncate mb-1", children: labels[stage] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground", children: stageDeals.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatCurrency(total) })
            ]
          },
          stage
        );
      }) }) })
    ] })
  ] });
}
export {
  DashboardPage as default
};
