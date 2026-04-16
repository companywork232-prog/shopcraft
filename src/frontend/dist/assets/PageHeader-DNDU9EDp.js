import { j as jsxRuntimeExports, a as Button, G as Separator, g as cn } from "./index-BhbW23l5.js";
function PageHeader({
  title,
  description,
  action,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("space-y-4", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground tracking-tight truncate", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: description })
      ] }),
      action && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: action.onClick,
          "data-ocid": action["data-ocid"],
          className: "shrink-0 gap-1.5",
          children: [
            action.icon,
            action.label
          ]
        }
      ),
      children
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {})
  ] });
}
export {
  PageHeader as P
};
