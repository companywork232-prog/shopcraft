import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ActivityType,
  ContactStatus,
  DealStage,
  InvoiceStatus,
  PurchaseOrderStatus,
} from "../types";

type StatusVariant =
  | "default"
  | "success"
  | "warning"
  | "destructive"
  | "secondary"
  | "outline";

interface StatusConfig {
  label: string;
  variant: StatusVariant;
}

const CONTACT_STATUS: Record<string, StatusConfig> = {
  lead: { label: "Lead", variant: "secondary" },
  prospect: { label: "Prospect", variant: "default" },
  customer: { label: "Customer", variant: "success" },
};

const DEAL_STAGE: Record<string, StatusConfig> = {
  prospect: { label: "Prospect", variant: "secondary" },
  discovery: { label: "Discovery", variant: "default" },
  proposal: { label: "Proposal", variant: "warning" },
  negotiation: { label: "Negotiation", variant: "warning" },
  closed_won: { label: "Closed Won", variant: "success" },
  closed_lost: { label: "Closed Lost", variant: "destructive" },
};

const INVOICE_STATUS: Record<string, StatusConfig> = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  paid: { label: "Paid", variant: "success" },
  overdue: { label: "Overdue", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

const PO_STATUS: Record<string, StatusConfig> = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "default" },
  received: { label: "Received", variant: "success" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

const ACTIVITY_TYPE: Record<string, StatusConfig> = {
  call: { label: "Call", variant: "default" },
  email: { label: "Email", variant: "secondary" },
  meeting: { label: "Meeting", variant: "warning" },
  task: { label: "Task", variant: "outline" },
};

type StatusType =
  | "contact"
  | "deal"
  | "invoice"
  | "purchase-order"
  | "activity";

interface StatusBadgeProps {
  type: StatusType;
  value:
    | ContactStatus
    | DealStage
    | InvoiceStatus
    | PurchaseOrderStatus
    | ActivityType
    | string;
  className?: string;
}

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  success:
    "bg-[oklch(0.65_0.18_140/0.15)] text-[oklch(0.45_0.18_140)] border-[oklch(0.65_0.18_140/0.3)]",
  warning:
    "bg-[oklch(0.72_0.19_80/0.15)] text-[oklch(0.52_0.19_80)] border-[oklch(0.72_0.19_80/0.3)]",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  secondary: "bg-secondary text-secondary-foreground border-border",
  outline: "bg-transparent text-muted-foreground border-border",
};

const CONFIG_MAP: Record<StatusType, Record<string, StatusConfig>> = {
  contact: CONTACT_STATUS,
  deal: DEAL_STAGE,
  invoice: INVOICE_STATUS,
  "purchase-order": PO_STATUS,
  activity: ACTIVITY_TYPE,
};

export function StatusBadge({ type, value, className }: StatusBadgeProps) {
  const config = CONFIG_MAP[type]?.[value as string] ?? {
    label: String(value),
    variant: "secondary" as StatusVariant,
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        VARIANT_CLASSES[config.variant],
        className,
      )}
    >
      {config.label}
    </span>
  );
}
