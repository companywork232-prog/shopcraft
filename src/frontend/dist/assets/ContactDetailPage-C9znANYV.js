import { c as createLucideIcon, d as useParams, u as useNavigate, j as jsxRuntimeExports, a as Button, e as Building2, B as Briefcase, A as Activity } from "./index-BhbW23l5.js";
import { B as Badge } from "./badge-DanXJMsT.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-sXXIs-lD.js";
import { P as PageLoader } from "./LoadingSpinner-BKeIT-Ei.js";
import { S as StatusBadge } from "./StatusBadge-Baq1oYX3.js";
import { g as useGetContact, b as useListDeals, h as useListActivities } from "./use-backend-BSO58jnW.js";
import { a as formatDate, f as formatCurrency } from "./index-BZSQpLYM.js";
import { U as User } from "./user-CcslMhEX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
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
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
function ContactDetailPage() {
  const { id } = useParams({ from: "/crm/contacts/$id" });
  const navigate = useNavigate();
  const contactId = BigInt(id);
  const { data: contact, isLoading } = useGetContact(contactId);
  const { data: deals = [] } = useListDeals();
  const { data: activities = [] } = useListActivities();
  const contactDeals = deals.filter((d) => d.contactId === contactId);
  const contactActivities = activities.filter((a) => a.contactId === contactId);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, { label: "Loading contact…" });
  if (!contact)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Contact not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => navigate({ to: "/crm/contacts" }),
          className: "mt-4",
          children: "Back to Contacts"
        }
      )
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 max-w-5xl mx-auto space-y-6",
      "data-ocid": "contact_detail.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => navigate({ to: "/crm/contacts" }),
            className: "gap-1.5",
            "data-ocid": "contact_detail.back.link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
              " Contacts"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-2xl gradient-primary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-8 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: contact.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground flex items-center gap-1.5 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-3.5" }),
                  " ",
                  contact.company || "—"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { type: "contact", value: contact.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `mailto:${contact.email}`,
                  className: "flex items-center gap-1.5 text-sm text-primary hover:underline",
                  "data-ocid": "contact_detail.email.link",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" }),
                    " ",
                    contact.email
                  ]
                }
              ),
              contact.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4" }),
                " ",
                contact.phone
              ] })
            ] }),
            contact.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3", children: contact.notes })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", "data-ocid": "contact_detail.deals.card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4 text-muted-foreground" }),
              " Deals (",
              contactDeals.length,
              ")"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: contactDeals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No deals associated." }) : contactDeals.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between p-3 rounded-lg bg-muted/40",
                "data-ocid": `contact_detail.deal.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: d.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Close: ",
                      formatDate(d.closeDate)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm", children: formatCurrency(d.value) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { type: "deal", value: d.stage })
                  ] })
                ]
              },
              d.id.toString()
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "shadow-subtle",
              "data-ocid": "contact_detail.activities.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4 text-muted-foreground" }),
                  " Activities (",
                  contactActivities.length,
                  ")"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: contactActivities.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No activities recorded." }) : contactActivities.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-3 p-3 rounded-lg bg-muted/40",
                    "data-ocid": `contact_detail.activity.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { type: "activity", value: a.activityType }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm truncate", children: a.description }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                          "Due: ",
                          formatDate(a.dueDate)
                        ] })
                      ] }),
                      a.completedAt && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] shrink-0", children: "Done" })
                    ]
                  },
                  a.id.toString()
                )) })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  ContactDetailPage as default
};
