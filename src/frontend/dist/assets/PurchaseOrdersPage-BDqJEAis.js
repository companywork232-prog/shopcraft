import { r as reactExports, j as jsxRuntimeExports, k as ShoppingCart, l as PurchaseOrderStatus, a as Button, b as ue } from "./index-BhbW23l5.js";
import { E as EmptyState, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./EmptyState-Bv92Pa6i.js";
import { L as Label, I as Input } from "./label-CMEqQw-D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIk2eUkt.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Bd3FKH5T.js";
import { P as PageLoader } from "./LoadingSpinner-BKeIT-Ei.js";
import { P as PageHeader } from "./PageHeader-DNDU9EDp.js";
import { S as StatusBadge } from "./StatusBadge-Baq1oYX3.js";
import { q as useListPurchaseOrders, c as useListProducts, r as useCreatePurchaseOrder, s as useUpdatePurchaseOrderStatus } from "./use-backend-BSO58jnW.js";
import { a as formatDate } from "./index-BZSQpLYM.js";
import { P as Plus } from "./plus-BydzK4cm.js";
const STATUS_OPTIONS = [
  { value: PurchaseOrderStatus.draft, label: "Draft" },
  { value: PurchaseOrderStatus.submitted, label: "Submitted" },
  { value: PurchaseOrderStatus.received, label: "Received" },
  { value: PurchaseOrderStatus.cancelled, label: "Cancelled" }
];
function PurchaseOrdersPage() {
  const { data: orders = [], isLoading } = useListPurchaseOrders();
  const { data: products = [] } = useListProducts();
  const createPO = useCreatePurchaseOrder();
  const updateStatus = useUpdatePurchaseOrderStatus();
  const [open, setOpen] = reactExports.useState(false);
  const [vendor, setVendor] = reactExports.useState("");
  const [expectedDelivery, setExpectedDelivery] = reactExports.useState("");
  const [lineItems, setLineItems] = reactExports.useState([{ productId: "", quantity: "", unitCost: "" }]);
  const addLine = () => setLineItems((prev) => [
    ...prev,
    { productId: "", quantity: "", unitCost: "" }
  ]);
  const removeLine = (idx) => setLineItems((prev) => prev.filter((_, i) => i !== idx));
  const updateLine = (idx, field, value) => setLineItems(
    (prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item)
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validLines = lineItems.filter(
      (l) => l.productId && l.quantity && l.unitCost
    );
    if (validLines.length === 0) {
      ue.error("Add at least one line item");
      return;
    }
    try {
      const items = validLines.map((l) => ({
        productId: BigInt(l.productId),
        quantity: BigInt(l.quantity),
        unitCost: BigInt(Math.round(Number.parseFloat(l.unitCost) * 100))
      }));
      const deliveryMs = new Date(expectedDelivery).getTime();
      await createPO.mutateAsync({
        vendor,
        lineItems: items,
        expectedDelivery: BigInt(deliveryMs) * 1000000n
      });
      ue.success("Purchase order created");
      setOpen(false);
      setVendor("");
      setExpectedDelivery("");
      setLineItems([{ productId: "", quantity: "", unitCost: "" }]);
    } catch {
      ue.error("Failed to create purchase order");
    }
  };
  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      ue.success("Status updated");
    } catch {
      ue.error("Failed to update status");
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, { label: "Loading purchase orders…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 max-w-6xl mx-auto space-y-6",
      "data-ocid": "purchase_orders.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PageHeader,
          {
            title: "Purchase Orders",
            description: `${orders.length} total purchase orders`,
            action: {
              label: "New PO",
              onClick: () => setOpen(true),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              "data-ocid": "purchase_orders.add_button"
            }
          }
        ),
        orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "size-8" }),
            title: "No purchase orders",
            description: "Create a purchase order to restock your inventory.",
            action: {
              label: "New PO",
              onClick: () => setOpen(true),
              "data-ocid": "purchase_orders.empty_state.add_button"
            },
            "data-ocid": "purchase_orders.empty_state"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "PO #" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Vendor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "Items" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell", children: "Expected Delivery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-40", children: "Change Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: orders.map((po, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              "data-ocid": `purchase_orders.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-xs text-muted-foreground", children: [
                  "PO-",
                  po.id.toString().padStart(4, "0")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm", children: po.vendor }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "hidden md:table-cell text-sm text-muted-foreground", children: [
                  po.lineItems.length,
                  " items"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm text-muted-foreground", children: formatDate(po.expectedDelivery) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { type: "purchase-order", value: po.status }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: po.status,
                    onValueChange: (v) => handleStatusChange(po.id, v),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          className: "h-7 text-xs",
                          "data-ocid": `purchase_orders.status.select.${i + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.value, children: s.label }, s.value)) })
                    ]
                  }
                ) })
              ]
            },
            po.id.toString()
          )) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "purchase_orders.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Purchase Order" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "po-vendor", children: "Vendor *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "po-vendor",
                    value: vendor,
                    onChange: (e) => setVendor(e.target.value),
                    required: true,
                    "data-ocid": "purchase_orders.vendor.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "po-delivery", children: "Expected delivery *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "po-delivery",
                    type: "date",
                    value: expectedDelivery,
                    onChange: (e) => setExpectedDelivery(e.target.value),
                    required: true,
                    "data-ocid": "purchase_orders.delivery_date.input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Line Items" }),
              lineItems.map((line, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex gap-2 items-end",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: line.productId,
                        onValueChange: (v) => updateLine(idx, "productId", v),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Product" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectItem,
                            {
                              value: p.id.toString(),
                              children: p.name
                            },
                            p.id.toString()
                          )) })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        placeholder: "Qty",
                        type: "number",
                        min: "1",
                        className: "w-16 h-8 text-xs",
                        value: line.quantity,
                        onChange: (e) => updateLine(idx, "quantity", e.target.value)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        placeholder: "Cost $",
                        type: "number",
                        min: "0",
                        step: "0.01",
                        className: "w-20 h-8 text-xs",
                        value: line.unitCost,
                        onChange: (e) => updateLine(idx, "unitCost", e.target.value)
                      }
                    ),
                    lineItems.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        className: "size-8",
                        onClick: () => removeLine(idx),
                        children: "×"
                      }
                    )
                  ]
                },
                `line-item-${line.productId || idx}-${idx}`
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "text-xs h-7",
                  onClick: addLine,
                  children: "+ Add line"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setOpen(false),
                  "data-ocid": "purchase_orders.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: createPO.isPending,
                  "data-ocid": "purchase_orders.submit_button",
                  children: createPO.isPending ? "Creating…" : "Create PO"
                }
              )
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  PurchaseOrdersPage as default
};
