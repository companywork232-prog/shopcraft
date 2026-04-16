import { c as createLucideIcon, r as reactExports, f as ActivityType, j as jsxRuntimeExports, a as Button, b as ue } from "./index-BhbW23l5.js";
import { E as EmptyState, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./EmptyState-Bv92Pa6i.js";
import { L as Label, I as Input } from "./label-CMEqQw-D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIk2eUkt.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Bd3FKH5T.js";
import { T as Textarea } from "./textarea-Yq6ZyVPl.js";
import { P as PageLoader } from "./LoadingSpinner-BKeIT-Ei.js";
import { P as PageHeader } from "./PageHeader-DNDU9EDp.js";
import { S as StatusBadge } from "./StatusBadge-Baq1oYX3.js";
import { h as useListActivities, a as useListContacts, b as useListDeals, k as useCreateActivity, l as useCompleteActivity, m as useDeleteActivity } from "./use-backend-BSO58jnW.js";
import { a as formatDate } from "./index-BZSQpLYM.js";
import { P as Plus } from "./plus-BydzK4cm.js";
import { T as Trash2 } from "./trash-2-DGEA2bRA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
const TYPE_OPTIONS = [
  { value: ActivityType.call, label: "Call" },
  { value: ActivityType.email, label: "Email" },
  { value: ActivityType.meeting, label: "Meeting" },
  { value: ActivityType.task, label: "Task" }
];
function ActivitiesPage() {
  const { data: activities = [], isLoading } = useListActivities();
  const { data: contacts = [] } = useListContacts();
  const { data: deals = [] } = useListDeals();
  const createActivity = useCreateActivity();
  const completeActivity = useCompleteActivity();
  const deleteActivity = useDeleteActivity();
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    activityType: ActivityType.call,
    description: "",
    contactId: "",
    dealId: "",
    dueDate: ""
  });
  const sorted = [...activities].sort((a, b) => Number(a.dueDate - b.dueDate));
  const pending = sorted.filter((a) => !a.completedAt);
  const completed = sorted.filter((a) => !!a.completedAt);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contactId) {
      ue.error("Select a contact");
      return;
    }
    try {
      const dueMs = new Date(form.dueDate).getTime();
      await createActivity.mutateAsync({
        activityType: form.activityType,
        description: form.description,
        contactId: BigInt(form.contactId),
        dealId: form.dealId ? BigInt(form.dealId) : null,
        dueDate: BigInt(dueMs) * 1000000n
      });
      ue.success("Activity created");
      setOpen(false);
      setForm({
        activityType: ActivityType.call,
        description: "",
        contactId: "",
        dealId: "",
        dueDate: ""
      });
    } catch {
      ue.error("Failed to create activity");
    }
  };
  const handleComplete = async (id) => {
    try {
      await completeActivity.mutateAsync({
        id,
        completedAt: BigInt(Date.now()) * 1000000n
      });
      ue.success("Activity marked complete");
    } catch {
      ue.error("Failed to complete activity");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteActivity.mutateAsync(id);
      ue.success("Activity deleted");
    } catch {
      ue.error("Failed to delete activity");
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, { label: "Loading activities…" });
  const contactName = (id) => {
    var _a;
    return ((_a = contacts.find((c) => c.id === id)) == null ? void 0 : _a.name) ?? "—";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 max-w-6xl mx-auto space-y-6",
      "data-ocid": "activities.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PageHeader,
          {
            title: "Activities",
            description: `${pending.length} pending, ${completed.length} completed`,
            action: {
              label: "New Activity",
              onClick: () => setOpen(true),
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              "data-ocid": "activities.add_button"
            }
          }
        ),
        activities.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-8" }),
            title: "No activities yet",
            description: "Schedule calls, emails, meetings, and tasks to keep track of your customer interactions.",
            action: {
              label: "New Activity",
              onClick: () => setOpen(true),
              "data-ocid": "activities.empty_state.add_button"
            },
            "data-ocid": "activities.empty_state"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5" }),
              " Pending (",
              pending.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "Contact" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Due" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-20" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: pending.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  "data-ocid": `activities.pending.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { type: "activity", value: a.activityType }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[200px] truncate text-sm", children: a.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-sm text-muted-foreground", children: contactName(a.contactId) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: formatDate(a.dueDate) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "size-7 text-emerald-600",
                          onClick: () => handleComplete(a.id),
                          "data-ocid": `activities.complete_button.${i + 1}`,
                          "aria-label": "Mark complete",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "size-7 text-destructive/60 hover:text-destructive",
                          onClick: () => handleDelete(a.id),
                          "data-ocid": `activities.delete_button.${i + 1}`,
                          "aria-label": "Delete",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                        }
                      )
                    ] }) })
                  ]
                },
                a.id.toString()
              )) })
            ] }) })
          ] }),
          completed.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
              " Completed (",
              completed.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden opacity-70", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "Contact" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Completed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: completed.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  "data-ocid": `activities.completed.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { type: "activity", value: a.activityType }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-[200px] truncate text-sm line-through text-muted-foreground", children: a.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-sm text-muted-foreground", children: contactName(a.contactId) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: a.completedAt ? formatDate(a.completedAt) : "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-7 text-destructive/60 hover:text-destructive",
                        onClick: () => handleDelete(a.id),
                        "data-ocid": `activities.completed.delete_button.${i + 1}`,
                        "aria-label": "Delete",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                      }
                    ) })
                  ]
                },
                a.id.toString()
              )) })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "activities.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Activity" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: form.activityType,
                    onValueChange: (v) => setForm({ ...form, activityType: v }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "activities.type.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: TYPE_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "activities.contact.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select…" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: contacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id.toString(), children: c.name }, c.id.toString())) })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "a-desc", children: "Description *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "a-desc",
                  value: form.description,
                  onChange: (e) => setForm({ ...form, description: e.target.value }),
                  required: true,
                  rows: 2,
                  "data-ocid": "activities.description.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "a-due", children: "Due date *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "a-due",
                    type: "date",
                    value: form.dueDate,
                    onChange: (e) => setForm({ ...form, dueDate: e.target.value }),
                    required: true,
                    "data-ocid": "activities.due_date.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Deal (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: form.dealId,
                    onValueChange: (v) => setForm({ ...form, dealId: v }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "activities.deal.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "None" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "", children: "None" }),
                        deals.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d.id.toString(), children: d.title }, d.id.toString()))
                      ] })
                    ]
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
                  "data-ocid": "activities.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: createActivity.isPending,
                  "data-ocid": "activities.submit_button",
                  children: createActivity.isPending ? "Creating…" : "Create Activity"
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
  ActivitiesPage as default
};
