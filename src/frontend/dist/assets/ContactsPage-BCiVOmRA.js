import { r as reactExports, C as ContactStatus, j as jsxRuntimeExports, a as Button, b as ue, u as useNavigate } from "./index-BhbW23l5.js";
import { E as EmptyState, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./EmptyState-Bv92Pa6i.js";
import { I as Input, L as Label } from "./label-CMEqQw-D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIk2eUkt.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Bd3FKH5T.js";
import { T as Textarea } from "./textarea-Yq6ZyVPl.js";
import { P as PageLoader } from "./LoadingSpinner-BKeIT-Ei.js";
import { P as PageHeader } from "./PageHeader-DNDU9EDp.js";
import { S as StatusBadge } from "./StatusBadge-Baq1oYX3.js";
import { a as useListContacts, e as useCreateContact, f as useDeleteContact } from "./use-backend-BSO58jnW.js";
import { P as Plus } from "./plus-BydzK4cm.js";
import { S as Search } from "./search-qNsWirmS.js";
import { U as User } from "./user-CcslMhEX.js";
import { T as Trash2 } from "./trash-2-DGEA2bRA.js";
const STATUS_OPTIONS = [
  { value: ContactStatus.lead, label: "Lead" },
  { value: ContactStatus.prospect, label: "Prospect" },
  { value: ContactStatus.customer, label: "Customer" }
];
function ContactRow({
  contact,
  index,
  onDelete
}) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    TableRow,
    {
      className: "cursor-pointer hover:bg-muted/40",
      onClick: () => navigate({
        to: "/crm/contacts/$id",
        params: { id: contact.id.toString() }
      }),
      "data-ocid": `contacts.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: contact.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground", children: contact.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground hidden md:table-cell", children: contact.company }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-muted-foreground", children: contact.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { type: "contact", value: contact.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "size-7 text-destructive hover:text-destructive hover:bg-destructive/10",
            onClick: (e) => {
              e.stopPropagation();
              onDelete(contact.id);
            },
            "data-ocid": `contacts.delete_button.${index}`,
            "aria-label": "Delete contact",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
          }
        ) })
      ]
    }
  );
}
function ContactsPage() {
  const { data: contacts = [], isLoading } = useListContacts();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const [search, setSearch] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: ContactStatus.lead,
    notes: ""
  });
  const filtered = contacts.filter(
    (c) => [c.name, c.email, c.company].some(
      (f) => f.toLowerCase().includes(search.toLowerCase())
    )
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact.mutateAsync(form);
      ue.success("Contact created");
      setOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: ContactStatus.lead,
        notes: ""
      });
    } catch {
      ue.error("Failed to create contact");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteContact.mutateAsync(id);
      ue.success("Contact deleted");
    } catch {
      ue.error("Failed to delete contact");
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, { label: "Loading contacts…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-6xl mx-auto space-y-6", "data-ocid": "contacts.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Contacts",
        description: `${contacts.length} total contacts`,
        action: {
          label: "Add Contact",
          onClick: () => setOpen(true),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
          "data-ocid": "contacts.add_button"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search contacts…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9",
          "data-ocid": "contacts.search_input"
        }
      )
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-8" }),
        title: search ? "No contacts match your search" : "No contacts yet",
        description: search ? "Try a different search term." : "Add your first contact to start managing relationships.",
        action: !search ? {
          label: "Add Contact",
          onClick: () => setOpen(true),
          "data-ocid": "contacts.empty_state.add_button"
        } : void 0,
        "data-ocid": "contacts.empty_state"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-border overflow-hidden shadow-subtle",
        "data-ocid": "contacts.table",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "Company" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ContactRow,
            {
              contact: c,
              index: i + 1,
              onDelete: handleDelete
            },
            c.id.toString()
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "contacts.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Contact" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "c-name", children: "Full name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "c-name",
                value: form.name,
                onChange: (e) => setForm({ ...form, name: e.target.value }),
                required: true,
                "data-ocid": "contacts.name.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "c-email", children: "Email *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "c-email",
                type: "email",
                value: form.email,
                onChange: (e) => setForm({ ...form, email: e.target.value }),
                required: true,
                "data-ocid": "contacts.email.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "c-phone", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "c-phone",
                value: form.phone,
                onChange: (e) => setForm({ ...form, phone: e.target.value }),
                "data-ocid": "contacts.phone.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "c-company", children: "Company" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "c-company",
                value: form.company,
                onChange: (e) => setForm({ ...form, company: e.target.value }),
                "data-ocid": "contacts.company.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.status,
                onValueChange: (v) => setForm({ ...form, status: v }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "contacts.status.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "c-notes", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "c-notes",
                value: form.notes,
                onChange: (e) => setForm({ ...form, notes: e.target.value }),
                rows: 3,
                "data-ocid": "contacts.notes.textarea"
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
              "data-ocid": "contacts.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: createContact.isPending,
              "data-ocid": "contacts.submit_button",
              children: createContact.isPending ? "Creating…" : "Create Contact"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ContactsPage as default
};
