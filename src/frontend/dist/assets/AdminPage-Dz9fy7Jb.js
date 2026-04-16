import { c as createLucideIcon, p as useAuth, r as reactExports, R as Role, j as jsxRuntimeExports, a as Button, q as Settings, b as ue, s as Principal } from "./index-BhbW23l5.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-sXXIs-lD.js";
import { L as Label, I as Input, X } from "./label-CMEqQw-D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BIk2eUkt.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-Bd3FKH5T.js";
import { P as PageLoader } from "./LoadingSpinner-BKeIT-Ei.js";
import { P as PageHeader } from "./PageHeader-DNDU9EDp.js";
import { x as useListUserRoles, y as useAssignRole, z as useRemoveRole, A as useBootstrapFirstAdmin } from "./use-backend-BSO58jnW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
const ROLE_OPTIONS = [
  {
    value: Role.admin,
    label: "Admin",
    description: "Full access to all features"
  },
  {
    value: Role.manager,
    label: "Manager",
    description: "CRM + ERP access, no admin panel"
  },
  { value: Role.sales_rep, label: "Sales Rep", description: "CRM access only" },
  { value: Role.finance, label: "Finance", description: "ERP access only" }
];
const ROLE_COLORS = {
  [Role.admin]: "bg-destructive/10 text-destructive border-destructive/20",
  [Role.manager]: "bg-primary/10 text-primary border-primary/20",
  [Role.sales_rep]: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40",
  [Role.finance]: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40"
};
function AdminPage() {
  const { role: myRole } = useAuth();
  const { data: userRoles = [], isLoading } = useListUserRoles();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  const bootstrapAdmin = useBootstrapFirstAdmin();
  const [newPrincipal, setNewPrincipal] = reactExports.useState("");
  const [newRole, setNewRole] = reactExports.useState(Role.sales_rep);
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!newPrincipal.trim()) {
      ue.error("Enter a principal ID");
      return;
    }
    try {
      const userId = Principal.fromText(newPrincipal.trim());
      await assignRole.mutateAsync({ userId, role: newRole });
      ue.success("Role assigned successfully");
      setNewPrincipal("");
    } catch {
      ue.error("Failed to assign role — check the principal ID format");
    }
  };
  const handleRemove = async (userId) => {
    try {
      await removeRole.mutateAsync(userId);
      ue.success("Role removed");
    } catch {
      ue.error("Failed to remove role");
    }
  };
  const handleBootstrap = async () => {
    try {
      await bootstrapAdmin.mutateAsync();
      ue.success("You are now the first admin!");
    } catch {
      ue.error("Bootstrap failed — admin may already exist");
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, { label: "Loading admin panel…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-5xl mx-auto space-y-6", "data-ocid": "admin.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Admin Panel",
        description: "Manage user roles and system settings"
      }
    ),
    userRoles.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "border-amber-300 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/10 shadow-subtle",
        "data-ocid": "admin.bootstrap.card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-5 text-amber-600 dark:text-amber-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-1", children: "First-time Setup" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "No admin roles exist yet. Bootstrap yourself as the first admin to get started." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleBootstrap,
                disabled: bootstrapAdmin.isPending,
                "data-ocid": "admin.bootstrap.button",
                children: bootstrapAdmin.isPending ? "Bootstrapping…" : "Bootstrap as Admin"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", "data-ocid": "admin.assign_role.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4 text-muted-foreground" }),
          "Assign Role"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAssign, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ar-principal", children: "Principal ID *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ar-principal",
                  value: newPrincipal,
                  onChange: (e) => setNewPrincipal(e.target.value),
                  placeholder: "aaaaa-bbbbb-ccccc-ddddd-eee",
                  className: "font-mono text-xs",
                  "data-ocid": "admin.principal.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Role" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: newRole,
                  onValueChange: (v) => setNewRole(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin.role.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ROLE_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: o.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: o.description })
                    ] }) }, o.value)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "w-full",
                disabled: assignRole.isPending,
                "data-ocid": "admin.assign_button",
                children: assignRole.isPending ? "Assigning…" : "Assign Role"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-4 border-t border-border space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Role Reference" }),
            ROLE_OPTIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${ROLE_COLORS[r.value]}`,
                  children: r.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: r.description })
            ] }, r.value))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "lg:col-span-2 shadow-subtle",
          "data-ocid": "admin.users.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-4 text-muted-foreground" }),
              "Current User Roles (",
              userRoles.length,
              ")"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: userRoles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-10", children: "No roles assigned yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Principal ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: userRoles.map((ur, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  "data-ocid": `admin.user.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground max-w-[200px] truncate", children: ur.userId.toText() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[ur.role]}`,
                        children: ur.role
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: myRole === Role.admin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        className: "size-7 text-muted-foreground hover:text-destructive",
                        onClick: () => handleRemove(ur.userId),
                        "data-ocid": `admin.remove_role.button.${i + 1}`,
                        "aria-label": "Remove role",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" })
                      }
                    ) })
                  ]
                },
                ur.userId.toText()
              )) })
            ] }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  AdminPage as default
};
