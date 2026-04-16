import { b as useAuth, d as useGetMyOrders, j as jsxRuntimeExports, B as Button, m as motion, S as Skeleton, P as Package, f as formatPrice, L as Link } from "./index-DZsoK5NI.js";
import { B as Badge } from "./badge-D0lfTSVp.js";
import { C as ClipboardList, O as OrderStatusBadge } from "./OrderStatusBadge-JAUFAUoU.js";
import { S as ShoppingBag } from "./shopping-bag-CKfzG8ah.js";
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function OrderSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-lg" })
    ] })
  ] });
}
function OrderCard({ order, index }) {
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.06 },
      "data-ocid": `orders.item.${index + 1}`,
      className: "rounded-xl border border-border bg-card p-5 flex flex-col gap-4 hover:shadow-subtle transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-4 text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-semibold text-foreground text-sm", children: [
                "Order #",
                order.id.toString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground pl-6", children: formatDate(order.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusBadge, { status: order.status })
        ] }),
        firstItem && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: firstItem.title }),
          firstItem.quantity > 1n && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            " ",
            "×",
            firstItem.quantity.toString()
          ] }),
          extraCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-muted-foreground", children: [
            "+ ",
            extraCount,
            " more ",
            extraCount === 1 ? "item" : "items"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 pt-1 border-t border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground", children: formatPrice(order.total) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "text-xs font-normal text-muted-foreground",
              children: [
                order.items.length,
                " ",
                order.items.length === 1 ? "item" : "items"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function EmptyOrders() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
      "data-ocid": "orders.empty_state",
      className: "flex flex-col items-center justify-center gap-6 py-20 px-8 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-9 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "No orders yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm", children: "When you place your first order, it will appear here. Start shopping to get started!" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, "data-ocid": "orders.shop_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/catalog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-4 mr-2" }),
          "Browse Products"
        ] }) })
      ]
    }
  );
}
function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { data: orders, isLoading } = useGetMyOrders();
  if (!authLoading && !isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "orders.login_prompt",
        className: "flex flex-col items-center justify-center gap-6 min-h-[60vh] px-8 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "size-9 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Sign in to view your orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm", children: "Your order history is private. Please sign in with Internet Identity to continue." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: login, "data-ocid": "orders.login_button", children: "Sign In" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto w-full px-4 sm:px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "mb-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground", children: "My Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5 text-sm", children: "Track and review your purchase history" })
        ]
      }
    ),
    (isLoading || authLoading) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "orders.loading_state", className: "flex flex-col gap-4", children: Array.from({ length: 4 }, (_, i) => `skel-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderSkeleton, {}, k)) }),
    !isLoading && !authLoading && orders && orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "orders.list", className: "flex flex-col gap-4", children: orders.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order, index: i }, order.id.toString())) }),
    !isLoading && !authLoading && (!orders || orders.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyOrders, {})
  ] });
}
export {
  OrdersPage as default
};
