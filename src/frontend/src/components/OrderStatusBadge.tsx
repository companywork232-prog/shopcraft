import { cn } from "@/lib/utils";
import { OrderStatus } from "../backend";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    [OrderStatus.pending]: {
      label: "Pending",
      className: "bg-chart-5/10 text-chart-5 border-chart-5/30",
    },
    [OrderStatus.paid]: {
      label: "Paid",
      className: "bg-accent/10 text-accent border-accent/30",
    },
    [OrderStatus.shipped]: {
      label: "Shipped",
      className: "bg-primary/10 text-primary border-primary/30",
    },
    [OrderStatus.delivered]: {
      label: "Delivered",
      className: "bg-chart-2/10 text-chart-2 border-chart-2/30",
    },
    [OrderStatus.cancelled]: {
      label: "Cancelled",
      className: "bg-destructive/10 text-destructive border-destructive/30",
    },
  };

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
