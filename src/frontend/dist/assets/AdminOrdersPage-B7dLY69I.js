import { c as createLucideIcon, b as useAuth, s as useIsAdmin, r as reactExports, t as useAdminListOrders, v as useAdminUpdateOrderStatus, j as jsxRuntimeExports, B as Button, L as Link, S as Skeleton, f as formatPrice, O as OrderStatus, w as ORDER_STATUS_LABELS, l as ue } from "./index-DZsoK5NI.js";
import { C as Card } from "./card-ftk3gKig.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BceqpsVm.js";
import { C as ClipboardList, O as OrderStatusBadge } from "./OrderStatusBadge-JAUFAUoU.js";
import { T as TriangleAlert } from "./triangle-alert-BGCi-k1t.js";
import { A as ArrowLeft } from "./arrow-left-BPQqcUFk.js";
import "./check-D-dfsKku.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
const PAGE_SIZE = 20;
function truncatePrincipal(p) {
  if (p.length <= 14) return p;
  return `${p.slice(0, 6)}…${p.slice(-5)}`;
}
function AdminOrdersPage() {
  const { isAuthenticated, principal } = useAuth();
  const principalStr = principal == null ? void 0 : principal.toText();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin(principalStr);
  const [page, setPage] = reactExports.useState(0);
  const [updatingId, setUpdatingId] = reactExports.useState(null);
  const {
    data: orders = [],
    isLoading,
    refetch,
    isFetching
  } = useAdminListOrders(page, PAGE_SIZE);
  const updateStatus = useAdminUpdateOrderStatus();
  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await updateStatus.mutateAsync({
        id: orderId,
        status
      });
      ue.success("Order status updated");
    } catch {
      ue.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };
  const sortedOrders = [...orders].sort(
    (a, b) => Number(b.createdAt - a.createdAt)
  );
  if (!isAuthenticated || !isAdminLoading && !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8",
        "data-ocid": "admin_orders.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-8 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Access Denied" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 max-w-sm", children: "You don't have admin privileges to access this page." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Back to Store" }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10",
      "data-ocid": "admin_orders.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "icon", className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", "data-ocid": "admin_orders.link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-5 text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Orders" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  orders.length,
                  " orders on this page"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => refetch(),
              disabled: isFetching,
              "data-ocid": "admin_orders.secondary_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RefreshCw,
                  {
                    className: `size-3.5 mr-2 ${isFetching ? "animate-spin" : ""}`
                  }
                ),
                "Refresh"
              ]
            }
          )
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "admin_orders.loading_state", children: Array.from({ length: 8 }, (_, i) => `skel-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, k)) }) : sortedOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "p-16 flex flex-col items-center gap-4 text-center",
            "data-ocid": "admin_orders.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-7 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No orders yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Orders will appear here once customers start purchasing." })
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Order ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-muted-foreground", children: "Items" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-muted-foreground", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Update Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedOrders.map((order, idx) => {
            const isUpdating = updatingId === order.id;
            const itemCount = order.items.reduce(
              (s, i) => s + Number(i.quantity),
              0
            );
            const principalText = order.userId.toText();
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/50 hover:bg-muted/20 transition-colors",
                "data-ocid": `admin_orders.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
                    "#",
                    order.id.toString().padStart(6, "0")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-xs text-foreground bg-muted/50 px-2 py-0.5 rounded",
                      title: principalText,
                      children: truncatePrincipal(principalText)
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums text-foreground", children: itemCount }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold text-foreground tabular-nums", children: formatPrice(order.total) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusBadge, { status: order.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: new Date(
                    Number(order.createdAt) / 1e6
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: order.status,
                      onValueChange: (v) => handleStatusChange(order.id, v),
                      disabled: isUpdating,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "h-8 w-36 text-xs",
                            "data-ocid": `admin_orders.select.${idx + 1}`,
                            children: isUpdating ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3 animate-spin" }),
                              "Updating…"
                            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(OrderStatus).map(
                          (s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectItem,
                            {
                              value: s,
                              className: "text-xs",
                              children: ORDER_STATUS_LABELS[s]
                            },
                            s
                          )
                        ) })
                      ]
                    }
                  ) })
                ]
              },
              order.id.toString()
            );
          }) })
        ] }) }) }),
        !isLoading && orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Page ",
            page + 1,
            " · ",
            orders.length,
            " orders"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: page === 0 || isFetching,
                onClick: () => setPage((p) => Math.max(0, p - 1)),
                "data-ocid": "admin_orders.pagination_prev",
                children: "Previous"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: orders.length < PAGE_SIZE || isFetching,
                onClick: () => setPage((p) => p + 1),
                "data-ocid": "admin_orders.pagination_next",
                children: "Next"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  AdminOrdersPage as default
};
