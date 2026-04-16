import { r as reactExports, j as jsxRuntimeExports, P as Package, a as Button, b as ue } from "./index-BhbW23l5.js";
import { B as Badge } from "./badge-DanXJMsT.js";
import { E as EmptyState, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./EmptyState-Bv92Pa6i.js";
import { I as Input, L as Label } from "./label-CMEqQw-D.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Bd3FKH5T.js";
import { P as PageLoader } from "./LoadingSpinner-BKeIT-Ei.js";
import { P as PageHeader } from "./PageHeader-DNDU9EDp.js";
import { c as useListProducts, n as useCreateProduct, o as useDeleteProduct, p as useAdjustStock } from "./use-backend-BSO58jnW.js";
import { f as formatCurrency } from "./index-BZSQpLYM.js";
import { P as Plus } from "./plus-BydzK4cm.js";
import { S as Search } from "./search-qNsWirmS.js";
import { T as Trash2 } from "./trash-2-DGEA2bRA.js";
function StockCell({ product }) {
  const isLow = product.stockQuantity <= product.reorderThreshold;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `font-mono text-sm ${isLow ? "text-destructive font-semibold" : "text-foreground"}`,
        children: product.stockQuantity.toString()
      }
    ),
    isLow && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-[10px] px-1.5 py-0", children: "Low" })
  ] });
}
function ProductsPage() {
  const { data: products = [], isLoading } = useListProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const adjustStock = useAdjustStock();
  const [search, setSearch] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const [adjustId, setAdjustId] = reactExports.useState(null);
  const [delta, setDelta] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    name: "",
    sku: "",
    costPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    reorderThreshold: "",
    category: ""
  });
  const filtered = products.filter(
    (p) => [p.name, p.sku, p.category].some(
      (f) => f.toLowerCase().includes(search.toLowerCase())
    )
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync({
        name: form.name,
        sku: form.sku,
        costPrice: BigInt(Math.round(Number.parseFloat(form.costPrice) * 100)),
        sellingPrice: BigInt(
          Math.round(Number.parseFloat(form.sellingPrice) * 100)
        ),
        stockQuantity: BigInt(form.stockQuantity),
        reorderThreshold: BigInt(form.reorderThreshold),
        category: form.category
      });
      ue.success("Product created");
      setOpen(false);
      setForm({
        name: "",
        sku: "",
        costPrice: "",
        sellingPrice: "",
        stockQuantity: "",
        reorderThreshold: "",
        category: ""
      });
    } catch {
      ue.error("Failed to create product");
    }
  };
  const handleAdjust = async () => {
    if (!adjustId || !delta) return;
    try {
      await adjustStock.mutateAsync({ id: adjustId, delta: BigInt(delta) });
      ue.success("Stock adjusted");
      setAdjustId(null);
      setDelta("");
    } catch {
      ue.error("Failed to adjust stock");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteProduct.mutateAsync(id);
      ue.success("Product deleted");
    } catch {
      ue.error("Failed to delete product");
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, { label: "Loading products…" });
  const adjustingProduct = products.find((p) => p.id === adjustId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-6xl mx-auto space-y-6", "data-ocid": "products.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Products",
        description: `${products.length} products in inventory`,
        action: {
          label: "Add Product",
          onClick: () => setOpen(true),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
          "data-ocid": "products.add_button"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search products…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9",
          "data-ocid": "products.search_input"
        }
      )
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-8" }),
        title: search ? "No products match" : "No products yet",
        description: search ? "Try adjusting your search." : "Add products to manage your inventory.",
        action: !search ? {
          label: "Add Product",
          onClick: () => setOpen(true),
          "data-ocid": "products.empty_state.add_button"
        } : void 0,
        "data-ocid": "products.empty_state"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "SKU" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Cost" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          "data-ocid": `products.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground", children: p.sku }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-sm text-muted-foreground", children: p.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-sm", children: formatCurrency(p.costPrice) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-sm font-medium", children: formatCurrency(p.sellingPrice) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StockCell, { product: p }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "text-xs h-7 px-2",
                  onClick: () => {
                    setAdjustId(p.id);
                    setDelta("");
                  },
                  "data-ocid": `products.adjust_button.${i + 1}`,
                  children: "Adjust"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-7 text-destructive/60 hover:text-destructive",
                  onClick: () => handleDelete(p.id),
                  "data-ocid": `products.delete_button.${i + 1}`,
                  "aria-label": "Delete",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                }
              )
            ] }) })
          ]
        },
        p.id.toString()
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "products.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Product" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-name", children: "Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-name",
                value: form.name,
                onChange: (e) => setForm({ ...form, name: e.target.value }),
                required: true,
                "data-ocid": "products.name.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-sku", children: "SKU *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-sku",
                value: form.sku,
                onChange: (e) => setForm({ ...form, sku: e.target.value }),
                required: true,
                "data-ocid": "products.sku.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-cat", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-cat",
                value: form.category,
                onChange: (e) => setForm({ ...form, category: e.target.value }),
                "data-ocid": "products.category.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-cost", children: "Cost price ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-cost",
                type: "number",
                min: "0",
                step: "0.01",
                value: form.costPrice,
                onChange: (e) => setForm({ ...form, costPrice: e.target.value }),
                required: true,
                "data-ocid": "products.cost_price.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-sell", children: "Selling price ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-sell",
                type: "number",
                min: "0",
                step: "0.01",
                value: form.sellingPrice,
                onChange: (e) => setForm({ ...form, sellingPrice: e.target.value }),
                required: true,
                "data-ocid": "products.selling_price.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-qty", children: "Stock qty *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-qty",
                type: "number",
                min: "0",
                value: form.stockQuantity,
                onChange: (e) => setForm({ ...form, stockQuantity: e.target.value }),
                required: true,
                "data-ocid": "products.stock_qty.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p-threshold", children: "Reorder threshold *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "p-threshold",
                type: "number",
                min: "0",
                value: form.reorderThreshold,
                onChange: (e) => setForm({ ...form, reorderThreshold: e.target.value }),
                required: true,
                "data-ocid": "products.reorder_threshold.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => setOpen(false),
              "data-ocid": "products.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: createProduct.isPending,
              "data-ocid": "products.submit_button",
              children: createProduct.isPending ? "Creating…" : "Create Product"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: adjustId !== null,
        onOpenChange: (o) => !o && setAdjustId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-sm",
            "data-ocid": "products.adjust_stock.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Adjust Stock" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  adjustingProduct == null ? void 0 : adjustingProduct.name,
                  " — current stock:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: adjustingProduct == null ? void 0 : adjustingProduct.stockQuantity.toString() })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "adj-delta", children: "Delta (use negative to decrease)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "adj-delta",
                      type: "number",
                      value: delta,
                      onChange: (e) => setDelta(e.target.value),
                      placeholder: "+10 or -5",
                      "data-ocid": "products.stock_delta.input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: () => setAdjustId(null),
                      "data-ocid": "products.adjust_cancel_button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      onClick: handleAdjust,
                      disabled: !delta || adjustStock.isPending,
                      "data-ocid": "products.adjust_confirm_button",
                      children: adjustStock.isPending ? "Adjusting…" : "Apply"
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  ProductsPage as default
};
