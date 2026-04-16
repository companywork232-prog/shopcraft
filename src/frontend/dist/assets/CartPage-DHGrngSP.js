import { u as useCart, a as useNavigate, j as jsxRuntimeExports, m as motion, B as Button } from "./index-DZsoK5NI.js";
import { B as Badge } from "./badge-D0lfTSVp.js";
import { C as Card } from "./card-ftk3gKig.js";
import { S as Separator } from "./separator-tSHo2qEV.js";
import { A as AnimatePresence } from "./index-Di1jR6Fn.js";
import { S as ShoppingBag } from "./shopping-bag-CKfzG8ah.js";
import { M as Minus } from "./minus-C8UZ6_76.js";
import { P as Plus } from "./plus-DQJ_UeoP.js";
import { T as Trash2 } from "./trash-2-CNaW_Ylo.js";
import "./index-CrEIOzH3.js";
function formatPrice(cents) {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(dollars);
}
const SHIPPING_THRESHOLD = 10000n;
const SHIPPING_COST = 999n;
function CartItemRow({
  item,
  index,
  onRemove,
  onUpdateQty
}) {
  const subtotal = item.price * BigInt(item.quantity);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
      transition: { delay: index * 0.06, duration: 0.28 },
      "data-ocid": `cart.item.${index + 1}`,
      className: "flex gap-4 p-4 items-start",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted border border-border", children: item.image ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: item.image,
            alt: item.title,
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 text-muted-foreground" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground leading-tight truncate pr-2", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground whitespace-nowrap", children: formatPrice(subtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            formatPrice(item.price),
            " each"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1 border border-border rounded-lg overflow-hidden bg-background",
                "data-ocid": `cart.qty_stepper.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150",
                      onClick: () => onUpdateQty(item.productId, item.quantity - 1),
                      "aria-label": "Decrease quantity",
                      "data-ocid": `cart.qty_decrease.${index + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center text-sm font-semibold text-foreground select-none", children: item.quantity }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150",
                      onClick: () => onUpdateQty(item.productId, item.quantity + 1),
                      "aria-label": "Increase quantity",
                      "data-ocid": `cart.qty_increase.${index + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors duration-150 ml-auto",
                onClick: () => onRemove(item.productId),
                "aria-label": `Remove ${item.title}`,
                "data-ocid": `cart.delete_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Remove" })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function EmptyCart() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      "data-ocid": "cart.empty_state",
      className: "flex flex-col items-center justify-center py-24 px-8 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-9 h-9 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Your cart is empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm mb-8", children: "Looks like you haven't added anything yet. Browse our catalog and find something you love." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => navigate({ to: "/catalog" }),
            "data-ocid": "cart.browse_catalog_button",
            children: "Browse Catalog"
          }
        )
      ]
    }
  );
}
function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0n : SHIPPING_COST;
  const total = totalPrice + shipping;
  const freeShippingRemaining = SHIPPING_THRESHOLD - totalPrice;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-bold text-foreground", children: "Shopping Cart" }),
      items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-sm", children: [
        items.length,
        " ",
        items.length === 1 ? "item" : "items"
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-8", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyCart, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "cart.list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "overflow-hidden divide-y divide-border shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          CartItemRow,
          {
            item,
            index: idx,
            onRemove: removeItem,
            onUpdateQty: updateQuantity
          },
          item.productId.toString()
        )) }) }),
        shipping > 0n && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "mt-4 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-2",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground", children: [
              "Add",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: formatPrice(freeShippingRemaining) }),
              " ",
              "more for free shipping"
            ] })
          }
        ),
        shipping === 0n && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "mt-4 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-2",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "🎉 You qualify for free shipping!" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.15, duration: 0.3 },
          "data-ocid": "cart.order_summary",
          className: "lg:sticky lg:top-24",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 shadow-elevated", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground mb-5", children: "Order Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Subtotal (",
                  items.reduce((s, i) => s + i.quantity, 0),
                  " ",
                  items.reduce((s, i) => s + i.quantity, 0) === 1 ? "item" : "items",
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: formatPrice(totalPrice) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shipping estimate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: shipping === 0n ? "text-accent font-semibold" : "text-foreground font-medium",
                    children: shipping === 0n ? "Free" : formatPrice(shipping)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-base font-bold text-foreground pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(total) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full mt-6 h-12 text-base font-semibold",
                onClick: () => navigate({ to: "/checkout" }),
                "data-ocid": "cart.checkout_button",
                children: "Proceed to Checkout"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                className: "w-full mt-2 text-muted-foreground",
                onClick: () => navigate({ to: "/catalog" }),
                "data-ocid": "cart.continue_shopping_button",
                children: "Continue Shopping"
              }
            )
          ] })
        }
      )
    ] }) })
  ] });
}
export {
  CartPage as default
};
