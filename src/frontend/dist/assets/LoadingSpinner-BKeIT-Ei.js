import { j as jsxRuntimeExports, g as cn } from "./index-BhbW23l5.js";
const SIZE_CLASSES = {
  sm: "size-4 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-[3px]"
};
function LoadingSpinner({
  size = "md",
  className,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center gap-3",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "rounded-full border-muted-foreground/20 border-t-primary animate-spin",
              SIZE_CLASSES[size]
            ),
            role: "status",
            "aria-label": label ?? "Loading"
          }
        ),
        label && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label })
      ]
    }
  );
}
function PageLoader({ label = "Loading…" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center min-h-[40vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label }) });
}
export {
  PageLoader as P
};
