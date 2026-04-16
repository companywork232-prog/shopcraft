import { c as createLucideIcon, u as useCart, a as useNavigate, W as useCreateOrder, r as reactExports, j as jsxRuntimeExports, B as Button, l as ue, P as Package, m as motion, T as Input } from "./index-DZsoK5NI.js";
import { B as Badge } from "./badge-D0lfTSVp.js";
import { C as Card } from "./card-ftk3gKig.js";
import { L as Label } from "./label-BjrGcWMH.js";
import { S as Separator } from "./separator-tSHo2qEV.js";
import { S as ShoppingBag } from "./shopping-bag-CKfzG8ah.js";
import { A as AnimatePresence } from "./index-Di1jR6Fn.js";
import { C as Check } from "./check-D-dfsKku.js";
import { C as ChevronRight } from "./chevron-right-CuSwHgft.js";
import "./index-CrEIOzH3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode);
function formatPrice(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(cents) / 100);
}
const SHIPPING_THRESHOLD = 10000n;
const SHIPPING_COST = 999n;
const STEPS = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: Package }
];
function StepIndicator({ current }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex items-center justify-center gap-0",
      "data-ocid": "checkout.step_indicator",
      children: STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        const Icon = step.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`,
                children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground"}`,
                children: step.label
              }
            )
          ] }),
          i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-16 sm:w-24 h-0.5 mb-5 mx-2 transition-colors duration-300 ${current > step.id ? "bg-primary" : "bg-border"}`
            }
          )
        ] }, step.id);
      })
    }
  );
}
function ShippingStep({
  form,
  onChange,
  onNext
}) {
  const [errors, setErrors] = reactExports.useState({});
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.street.trim()) e.street = "Street address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State / province is required";
    if (!form.zip.trim()) e.zip = "ZIP / postal code is required";
    if (!form.country.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleNext = () => {
    if (validate()) onNext();
  };
  const field = (id, label, placeholder, colSpan) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col gap-1.5 ${colSpan ?? ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: id, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        id,
        placeholder,
        value: form[id],
        onChange: (e) => {
          onChange({ ...form, [id]: e.target.value });
          if (errors[id]) setErrors((prev) => ({ ...prev, [id]: void 0 }));
        },
        onBlur: () => {
          if (!form[id].trim())
            setErrors((prev) => ({ ...prev, [id]: `${label} is required` }));
        },
        className: errors[id] ? "border-destructive" : "",
        "data-ocid": `checkout.shipping_${id}_input`
      }
    ),
    errors[id] && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-xs text-destructive",
        "data-ocid": `checkout.shipping_${id}_field_error`,
        children: errors[id]
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -30 },
      transition: { duration: 0.25 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          field("name", "Full Name", "Jane Doe", "sm:col-span-2"),
          field(
            "street",
            "Street Address",
            "123 Main St, Apt 4B",
            "sm:col-span-2"
          ),
          field("city", "City", "New York"),
          field("state", "State / Province", "NY"),
          field("zip", "ZIP / Postal Code", "10001"),
          field("country", "Country", "United States")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "w-full mt-6 h-12 text-base font-semibold",
            onClick: handleNext,
            "data-ocid": "checkout.shipping_next_button",
            children: [
              "Continue to Payment",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
            ]
          }
        )
      ]
    },
    "step-1"
  );
}
function formatCardNumber(v) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}
function PaymentStep({
  form,
  onChange,
  onNext,
  onBack
}) {
  const [errors, setErrors] = reactExports.useState({});
  const validate = () => {
    const e = {};
    if (form.cardNumber.replace(/\s/g, "").length < 16)
      e.cardNumber = "Valid card number required";
    if (form.expiry.length < 5) e.expiry = "Valid expiry required (MM/YY)";
    if (form.cvv.length < 3) e.cvv = "CVV must be 3–4 digits";
    if (!form.nameOnCard.trim()) e.nameOnCard = "Name on card is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -30 },
      transition: { duration: 0.25 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl gradient-primary p-5 text-white mb-6 relative overflow-hidden shadow-elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-10 translate-x-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 translate-y-10 -translate-x-10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-8 h-8 mb-4 opacity-90" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-lg tracking-widest mb-3 relative z-10", children: form.cardNumber || "•••• •••• •••• ••••" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm opacity-80 relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: form.nameOnCard || "NAME ON CARD" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: form.expiry || "MM/YY" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nameOnCard", children: "Name on Card" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "nameOnCard",
                placeholder: "Jane Doe",
                value: form.nameOnCard,
                onChange: (e) => {
                  onChange({ ...form, nameOnCard: e.target.value });
                  if (errors.nameOnCard)
                    setErrors((p) => ({ ...p, nameOnCard: void 0 }));
                },
                className: errors.nameOnCard ? "border-destructive" : "",
                "data-ocid": "checkout.payment_nameOnCard_input"
              }
            ),
            errors.nameOnCard && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "checkout.payment_nameOnCard_field_error",
                children: errors.nameOnCard
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cardNumber", children: "Card Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "cardNumber",
                placeholder: "1234 5678 9012 3456",
                value: form.cardNumber,
                onChange: (e) => {
                  onChange({
                    ...form,
                    cardNumber: formatCardNumber(e.target.value)
                  });
                  if (errors.cardNumber)
                    setErrors((p) => ({ ...p, cardNumber: void 0 }));
                },
                className: `font-mono ${errors.cardNumber ? "border-destructive" : ""}`,
                "data-ocid": "checkout.payment_cardNumber_input"
              }
            ),
            errors.cardNumber && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "checkout.payment_cardNumber_field_error",
                children: errors.cardNumber
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "expiry", children: "Expiry Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "expiry",
                placeholder: "MM/YY",
                value: form.expiry,
                onChange: (e) => {
                  onChange({ ...form, expiry: formatExpiry(e.target.value) });
                  if (errors.expiry)
                    setErrors((p) => ({ ...p, expiry: void 0 }));
                },
                className: errors.expiry ? "border-destructive" : "",
                "data-ocid": "checkout.payment_expiry_input"
              }
            ),
            errors.expiry && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "checkout.payment_expiry_field_error",
                children: errors.expiry
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cvv", children: "CVV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "cvv",
                placeholder: "•••",
                maxLength: 4,
                value: form.cvv,
                onChange: (e) => {
                  onChange({
                    ...form,
                    cvv: e.target.value.replace(/\D/g, "").slice(0, 4)
                  });
                  if (errors.cvv) setErrors((p) => ({ ...p, cvv: void 0 }));
                },
                className: errors.cvv ? "border-destructive" : "",
                "data-ocid": "checkout.payment_cvv_input"
              }
            ),
            errors.cvv && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "checkout.payment_cvv_field_error",
                children: errors.cvv
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5" }),
          "Your payment info is encrypted and secure"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1 h-12",
              onClick: onBack,
              "data-ocid": "checkout.payment_back_button",
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-2 flex-[2] h-12 text-base font-semibold",
              onClick: () => {
                if (validate()) onNext();
              },
              "data-ocid": "checkout.payment_next_button",
              children: [
                "Review Order",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
              ]
            }
          )
        ] })
      ]
    },
    "step-2"
  );
}
function ReviewStep({
  items,
  shipping,
  shippingForm,
  onBack,
  onSubmit,
  isSubmitting
}) {
  const totalPrice = items.reduce(
    (s, i) => s + i.price * BigInt(i.quantity),
    0n
  );
  const total = totalPrice + shipping;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -30 },
      transition: { duration: 0.25 },
      className: "space-y-5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 border border-border p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Shipping To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: shippingForm.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            shippingForm.street,
            ", ",
            shippingForm.city,
            ", ",
            shippingForm.state,
            " ",
            shippingForm.zip,
            ", ",
            shippingForm.country
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "checkout.review_items_list", children: items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 py-2",
            "data-ocid": `checkout.review_item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border shrink-0", children: item.image ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: item.image,
                  alt: item.title,
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-5 h-5 text-muted-foreground" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: item.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Qty: ",
                  item.quantity
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground whitespace-nowrap", children: formatPrice(item.price * BigInt(item.quantity)) })
            ]
          },
          item.productId.toString()
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", "data-ocid": "checkout.review_totals", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatPrice(totalPrice) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: shipping === 0n ? "text-accent font-semibold" : "text-foreground",
                children: shipping === 0n ? "Free" : formatPrice(shipping)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold text-base text-foreground pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(total) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1 h-12",
              onClick: onBack,
              disabled: isSubmitting,
              "data-ocid": "checkout.review_back_button",
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "flex-[2] h-12 text-base font-semibold",
              onClick: onSubmit,
              disabled: isSubmitting,
              "data-ocid": "checkout.submit_button",
              children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "flex items-center gap-2",
                  "data-ocid": "checkout.loading_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" }),
                    "Placing Order…"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 mr-1.5" }),
                "Place Order"
              ] })
            }
          )
        ] })
      ]
    },
    "step-3"
  );
}
function SuccessScreen({ orderId }) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center text-center py-10",
      "data-ocid": "checkout.success_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-9 h-9 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Order Placed!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-1 max-w-sm", children: "Thank you for your purchase. We'll send you a confirmation shortly." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-8", children: [
          "Order #",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: orderId })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1",
              onClick: () => navigate({ to: "/orders" }),
              "data-ocid": "checkout.view_orders_button",
              children: "View Orders"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "flex-1",
              onClick: () => navigate({ to: "/catalog" }),
              "data-ocid": "checkout.continue_shopping_button",
              children: "Continue Shopping"
            }
          )
        ] })
      ]
    }
  );
}
function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const [step, setStep] = reactExports.useState(1);
  const [orderId, setOrderId] = reactExports.useState(null);
  const [shippingForm, setShippingForm] = reactExports.useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });
  const [paymentForm, setPaymentForm] = reactExports.useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: ""
  });
  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0n : SHIPPING_COST;
  if (items.length === 0 && !orderId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", "data-ocid": "checkout.empty_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-12 h-12 text-muted-foreground mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Your cart is empty." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => navigate({ to: "/catalog" }),
          "data-ocid": "checkout.browse_button",
          children: "Browse Catalog"
        }
      )
    ] }) });
  }
  const handleSubmit = async () => {
    try {
      const result = await createOrder.mutateAsync({
        paymentIntent: `mock_pi_${Date.now()}`,
        shippingAddress: shippingForm
      });
      const id = typeof result === "object" && result !== null && "id" in result ? String(result.id) : String(Date.now());
      clearCart();
      setOrderId(id);
    } catch {
      ue.error("Failed to place order. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-bold text-foreground", children: "Checkout" }),
        !orderId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
          items.length,
          " ",
          items.length === 1 ? "item" : "items"
        ] })
      ] }),
      !orderId && /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: step })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 py-8", children: orderId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessScreen, { orderId }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "p-6 sm:p-8 shadow-elevated",
        "data-ocid": "checkout.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold text-foreground", children: [
              step === 1 && "Shipping Address",
              step === 2 && "Payment Details",
              step === 3 && "Review Your Order"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
              step === 1 && "Where should we deliver your order?",
              step === 2 && "Enter your card details to complete the purchase.",
              step === 3 && "Check everything looks right before confirming."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
            step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              ShippingStep,
              {
                form: shippingForm,
                onChange: setShippingForm,
                onNext: () => setStep(2)
              },
              "step1"
            ),
            step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              PaymentStep,
              {
                form: paymentForm,
                onChange: setPaymentForm,
                onBack: () => setStep(1),
                onNext: () => setStep(3)
              },
              "step2"
            ),
            step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReviewStep,
              {
                items,
                shipping,
                shippingForm,
                onBack: () => setStep(2),
                onSubmit: handleSubmit,
                isSubmitting: createOrder.isPending
              },
              "step3"
            )
          ] })
        ]
      }
    ) })
  ] });
}
export {
  CheckoutPage as default
};
