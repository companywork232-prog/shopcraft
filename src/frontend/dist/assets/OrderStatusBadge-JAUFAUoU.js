import { c as createLucideIcon, j as jsxRuntimeExports, o as cn, O as OrderStatus } from "./index-DZsoK5NI.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode);
const STATUS_CONFIG = {
  [OrderStatus.pending]: {
    label: "Pending",
    className: "bg-chart-5/10 text-chart-5 border-chart-5/30"
  },
  [OrderStatus.paid]: {
    label: "Paid",
    className: "bg-accent/10 text-accent border-accent/30"
  },
  [OrderStatus.shipped]: {
    label: "Shipped",
    className: "bg-primary/10 text-primary border-primary/30"
  },
  [OrderStatus.delivered]: {
    label: "Delivered",
    className: "bg-chart-2/10 text-chart-2 border-chart-2/30"
  },
  [OrderStatus.cancelled]: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/30"
  }
};
function OrderStatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        config.className,
        className
      ),
      children: config.label
    }
  );
}
export {
  ClipboardList as C,
  OrderStatusBadge as O
};
