import { r as reactExports, D as DealStage, j as jsxRuntimeExports, a as Button, b as ue } from "./index-BhbW23l5.js";
import { E as EmptyState, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./EmptyState-Bv92Pa6i.js";
import { L as Label, I as Input } from "./label-CMEqQw-D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIk2eUkt.js";
import { T as Textarea } from "./textarea-Yq6ZyVPl.js";
import { P as PageLoader } from "./LoadingSpinner-BKeIT-Ei.js";
import { P as PageHeader } from "./PageHeader-DNDU9EDp.js";
import { b as useListDeals, a as useListContacts, i as useCreateDeal, j as useDeleteDeal } from "./use-backend-BSO58jnW.js";
import { f as formatCurrency, a as formatDate } from "./index-BZSQpLYM.js";
import { T as Trash2 } from "./trash-2-DGEA2bRA.js";
const STAGES = [
  { value: DealStage.prospect, label: "Prospect" },
  { value: DealStage.discovery, label: "Discovery" },
  { value: DealStage.proposal, label: "Proposal" },
  { value: DealStage.negotiation, label: "Negotiation" },
  { value: DealStage.closed_won, label: "Closed Won" },
  { value: DealStage.closed_lost, label: "Closed Lost" }
];
const STAGE_ORDER = [
  "prospect",
  "discovery",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost"
];
function DealCard({
  deal,
  index,
  contacts,
  onDelete
}) {
  const contact = contacts.find((c) => c.id === deal.contactId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl p-4 shadow-subtle hover:shadow-elevated transition-smooth",
      "data-ocid": `deals.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate leading-tight", children: deal.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onDelete(deal.id),
              className: "shrink-0 size-6 flex items-center justify-center rounded text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-smooth",
              "data-ocid": `deals.delete_button.${index}`,
              "aria-label": "Delete deal",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground", children: formatCurrency(deal.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          (contact == null ? void 0 : contact.name) ?? "Unknown",
          " · Close ",
          formatDate(deal.closeDate)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          Number(deal.probability),
          "% probability"
        ] })
      ]
    }
  );
}
function DealsPage() {
  const { data: deals = [], isLoading } = useListDeals();
  const { data: contacts = [] } = useListContacts();
  const createDeal = useCreateDeal();
  const deleteDeal = useDeleteDeal();
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    title: "",
    value: "",
    stage: DealStage.prospect,
    contactId: "",
    probability: "50",
    closeDate: "",
    notes: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contactId) {
      ue.error("Select a contact");
      return;
    }
    try {
      const closeMs = new Date(form.closeDate).getTime();
      await createDeal.mutateAsync({
        title: form.title,
        value: BigInt(Math.round(Number.parseFloat(form.value) * 100)),
        stage: form.stage,
        contactId: BigInt(form.contactId),
        probability: BigInt(form.probability),
        closeDate: BigInt(closeMs) * 1000000n,
        notes: form.notes
      });
      ue.success("Deal created");
      setOpen(false);
      setForm({
        title: "",
        value: "",
        stage: DealStage.prospect,
        contactId: "",
        probability: "50",
        closeDate: "",
        notes: ""
      });
    } catch {
      ue.error("Failed to create deal");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteDeal.mutateAsync(id);
      ue.success("Deal deleted");
    } catch {
      ue.error("Failed to delete deal");
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, { label: "Loading deals…" });
  const contactList = contacts.map((c) => ({ id: c.id, name: c.name }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-7xl mx-auto space-y-6", "data-ocid": "deals.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Deals",
        description: `${deals.length} total deals`,
        action: {
          label: "New Deal",
          onClick: () => setOpen(true),
          "data-ocid": "deals.add_button"
        }
      }
    ),
    deals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "No deals yet",
        description: "Create your first deal to start tracking your sales pipeline.",
        action: {
          label: "New Deal",
          onClick: () => setOpen(true),
          "data-ocid": "deals.empty_state.add_button"
        },
        "data-ocid": "deals.empty_state"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 min-w-max", children: STAGE_ORDER.map((stage) => {
      const stageDeals = deals.filter((d) => d.stage === stage);
      const stageLabels = {
        prospect: "Prospect",
        discovery: "Discovery",
        proposal: "Proposal",
        negotiation: "Negotiation",
        closed_won: "Closed Won",
        closed_lost: "Closed Lost"
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-64 shrink-0",
          "data-ocid": `deals.stage.${stage}.column`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3 px-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground", children: stageLabels[stage] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full", children: stageDeals.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
              stageDeals.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                DealCard,
                {
                  deal: d,
                  index: i + 1,
                  contacts: contactList,
                  onDelete: handleDelete
                },
                d.id.toString()
              )),
              stageDeals.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No deals" }) })
            ] })
          ]
        },
        stage
      );
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "deals.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Deal" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "d-title", children: "Deal title *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "d-title",
              value: form.title,
              onChange: (e) => setForm({ ...form, title: e.target.value }),
              required: true,
              "data-ocid": "deals.title.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "d-value", children: "Value ($) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "d-value",
                type: "number",
                min: "0",
                step: "0.01",
                value: form.value,
                onChange: (e) => setForm({ ...form, value: e.target.value }),
                required: true,
                "data-ocid": "deals.value.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "d-prob", children: "Probability (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "d-prob",
                type: "number",
                min: "0",
                max: "100",
                value: form.probability,
                onChange: (e) => setForm({ ...form, probability: e.target.value }),
                "data-ocid": "deals.probability.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Stage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.stage,
                onValueChange: (v) => setForm({ ...form, stage: v }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "deals.stage.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.value, children: s.label }, s.value)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Contact *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.contactId,
                onValueChange: (v) => setForm({ ...form, contactId: v }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "deals.contact.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select…" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: contacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id.toString(), children: c.name }, c.id.toString())) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "d-close", children: "Close date *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "d-close",
              type: "date",
              value: form.closeDate,
              onChange: (e) => setForm({ ...form, closeDate: e.target.value }),
              required: true,
              "data-ocid": "deals.close_date.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "d-notes", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "d-notes",
              value: form.notes,
              onChange: (e) => setForm({ ...form, notes: e.target.value }),
              rows: 2,
              "data-ocid": "deals.notes.textarea"
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
              "data-ocid": "deals.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: createDeal.isPending,
              "data-ocid": "deals.submit_button",
              children: createDeal.isPending ? "Creating…" : "Create Deal"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  DealsPage as default
};
