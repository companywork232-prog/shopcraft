// Re-export all ERP+CRM types from backend
export type {
  Contact,
  ContactId,
  Deal,
  DealId,
  Activity,
  ActivityId,
  Product,
  ProductId,
  PurchaseOrder,
  PurchaseOrderId,
  Invoice,
  InvoiceId,
  InvoiceLineItem,
  PurchaseLineItem,
  FinancialSummary,
  UserRole,
  UserId,
  EntityId,
  Timestamp,
} from "../backend";

// Re-export enums as values (NOT type-only)
export {
  ActivityType,
  ContactStatus,
  DealStage,
  InvoiceStatus,
  PurchaseOrderStatus,
  Role,
} from "../backend";

// ─── UI helper types ─────────────────────────────────────────────────────────

export type NavSection = "crm" | "erp" | "admin";

export interface SidebarLink {
  label: string;
  to: string;
  icon: string;
  section: NavSection;
}

export const DEAL_STAGE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  discovery: "Discovery",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export const CONTACT_STATUS_LABELS: Record<string, string> = {
  lead: "Lead",
  prospect: "Prospect",
  customer: "Customer",
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export const PO_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  received: "Received",
  cancelled: "Cancelled",
};

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  task: "Task",
};

/** Format bigint cents → "$1,234.56" */
export function formatCurrency(cents: bigint): string {
  const n = Number(cents);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n / 100);
}

/** Format nanosecond timestamp → "Jan 5, 2024" */
export function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ms));
}
