import { r as reactExports, j as jsxRuntimeExports, F as FileText, I as InvoiceStatus, a as Button, b as ue } from "./index-BhbW23l5.js";
import { E as EmptyState, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./EmptyState-Bv92Pa6i.js";
import { L as Label, I as Input } from "./label-CMEqQw-D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIk2eUkt.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Bd3FKH5T.js";
import { P as PageLoader } from "./LoadingSpinner-BKeIT-Ei.js";
import { P as PageHeader } from "./PageHeader-DNDU9EDp.js";
import { S as StatusBadge } from "./StatusBadge-Baq1oYX3.js";
import { d as useListInvoices, a as useListContacts, t as useCreateInvoice, v as useUpdateInvoiceStatus, w as useDeleteInvoice } from "./use-backend-BSO58jnW.js";
import { a as formatDate, f as formatCurrency } from "./index-BZSQpLYM.js";
import { P as Plus } from "./plus-BydzK4cm.js";
import { T as Trash2 } from "./trash-2-DGEA2bRA.js";
const STATUS_OPTIONS = [
  { value: InvoiceStatus.draft, label: "Draft" },
  { value: InvoiceStatus.sent, label: "Sent" },
  { value: InvoiceStatus.paid, label: "Paid" },
  { value: InvoiceStatus.overdue, label: "Overdue" },
  { value: InvoiceStatus.cancelled, label: "Cancelled" }
];
function InvoicesPage() {
  const { data: invoices = [], isLoading } = useListInvoices();
  const { data: contacts = [] } = useListContacts();
  const createInvoice = useCreateInvoice();
  const updateStatus = useUpdateInvoiceStatus();
  const deleteInvoice = useDeleteInvoice();
  const [open, setOpen] = reactExports.useState(false);
  const [contactId, setContactId] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [lineItems, setLineItems] = reactExports.useState([{ description: "", quantity: "", unitPrice: "" }]);
  const addLine = () => setLineItems((prev) => [
    ...prev,
    { description: "", quantity: "", unitPrice: "" }
  ]);
  const removeLine = (idx) => setLineItems((prev) => prev.filter((_, i) => i !== idx));
  const updateLine = (idx, field, value) => setLineItems(
    (prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item)
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactId) {
      ue.error("Select a contact");
      return;
    }
    const validLines = lineItems.filter(
      (l) => l.description && l.quantity && l.unitPrice
    );
    if (validLines.length === 0) {
      ue.error("Add at least one line item");
      return;
    }
    try {
      const items = validLines.map((l) => ({
        description: l.description,
        quantity: BigInt(l.quantity),
        unitPrice: BigInt(Math.round(Number.parseFloat(l.unitPrice) * 100))
      }));
      const dueDateMs = new Date(dueDate).getTime();
      await createInvoice.mutateAsync({
        contactId: BigInt(contactId),
        dealId: null,
        lineItems: items,
        dueDate: BigInt(dueDateMs) * 1000000n
      });
      ue.success("Invoice created");
      setOpen(false);
      setContactId("");
      setDueDate("");
      setLineItems([{ description: "", quantity: "", unitPrice: "" }]);
    } catch {
      ue.error("Failed to create invoice");
    }
  };
  const handleStatusChange = async (id, status) => {
    const paidAt = status === InvoiceStatus.paid ? BigInt(Date.now()) * 1000000n : null;
    try {
      await updateStatus.mutateAsync({ id, status, paidAt });
      ue.success("Status updated");
    } catch {
      ue.error("Failed to update status");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteInvoice.mutateAsync(id);
      ue.success("Invoice deleted");
    } catch {
      ue.error("Failed to delete invoice");
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, { label: "Loading invoices…" });
  const totalAmount = (inv) => inv.lineItems.reduce((s, li) => s + li.quantity * li.unitPrice, 0n);
  const contactName = (id) => {
    var _a;
    return ((_a = contacts.find((c) => c.id === id)) == null ? void 0 : _a.name) ?? "—";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-6xl mx-auto space-y-6", "data-ocid": "invoices.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Invoices",
        description: `${invoices.length} total invoices`,
        action: {
          label: "New Invoice",
          onClick: () => setOpen(true),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
          "data-ocid": "invoices.add_button"
        }
      }
    ),
    invoices.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-8" }),
        title: "No invoices yet",
        description: "Create your first invoice to start billing customers.",
        action: {
          label: "New Invoice",
          onClick: () => setOpen(true),
          "data-ocid": "invoices.empty_state.add_button"
        },
        "data-ocid": "invoices.empty_state"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Invoice #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell", children: "Issued" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell", children: "Due" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-40", children: "Change Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: [...invoices].sort((a, b) => Number(b.issuedAt - a.issuedAt)).map((inv, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          "data-ocid": `invoices.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs", children: inv.invoiceNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-sm", children: contactName(inv.contactId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm text-muted-foreground", children: formatDate(inv.issuedAt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm text-muted-foreground", children: formatDate(inv.dueDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-medium text-sm", children: formatCurrency(totalAmount(inv)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { type: "invoice", value: inv.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: inv.status,
                onValueChange: (v) => handleStatusChange(inv.id, v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-7 text-xs",
                      "data-ocid": `invoices.status.select.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.value, children: s.label }, s.value)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "size-7 text-destructive/60 hover:text-destructive",
                onClick: () => handleDelete(inv.id),
                "data-ocid": `invoices.delete_button.${i + 1}`,
                "aria-label": "Delete",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
              }
            ) })
          ]
        },
        inv.id.toString()
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "invoices.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Invoice" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Contact *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: contactId, onValueChange: setContactId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "invoices.contact.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select…" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: contacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id.toString(), children: c.name }, c.id.toString())) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "inv-due", children: "Due date *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "inv-due",
                type: "date",
                value: dueDate,
                onChange: (e) => setDueDate(e.target.value),
                required: true,
                "data-ocid": "invoices.due_date.input"
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Description",
                    className: "flex-1 h-8 text-xs",
                    value: line.description,
                    onChange: (e) => updateLine(idx, "description", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Qty",
                    type: "number",
                    min: "1",
                    className: "w-14 h-8 text-xs",
                    value: line.quantity,
                    onChange: (e) => updateLine(idx, "quantity", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "$ each",
                    type: "number",
                    min: "0",
                    step: "0.01",
                    className: "w-20 h-8 text-xs",
                    value: line.unitPrice,
                    onChange: (e) => updateLine(idx, "unitPrice", e.target.value)
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
            `inv-line-${line.description || idx}-${idx}`
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
              "data-ocid": "invoices.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: createInvoice.isPending,
              "data-ocid": "invoices.submit_button",
              children: createInvoice.isPending ? "Creating…" : "Create Invoice"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  InvoicesPage as default
};
