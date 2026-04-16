import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../components/EmptyState";
import { PageLoader } from "../components/LoadingSpinner";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import {
  useCreateInvoice,
  useDeleteInvoice,
  useListContacts,
  useListInvoices,
  useUpdateInvoiceStatus,
} from "../hooks/use-backend";
import {
  type InvoiceLineItem,
  InvoiceStatus,
  formatCurrency,
  formatDate,
} from "../types";

const STATUS_OPTIONS = [
  { value: InvoiceStatus.draft, label: "Draft" },
  { value: InvoiceStatus.sent, label: "Sent" },
  { value: InvoiceStatus.paid, label: "Paid" },
  { value: InvoiceStatus.overdue, label: "Overdue" },
  { value: InvoiceStatus.cancelled, label: "Cancelled" },
];

export default function InvoicesPage() {
  const { data: invoices = [], isLoading } = useListInvoices();
  const { data: contacts = [] } = useListContacts();
  const createInvoice = useCreateInvoice();
  const updateStatus = useUpdateInvoiceStatus();
  const deleteInvoice = useDeleteInvoice();
  const [open, setOpen] = useState(false);
  const [contactId, setContactId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState<
    Array<{ description: string; quantity: string; unitPrice: string }>
  >([{ description: "", quantity: "", unitPrice: "" }]);

  const addLine = () =>
    setLineItems((prev) => [
      ...prev,
      { description: "", quantity: "", unitPrice: "" },
    ]);
  const removeLine = (idx: number) =>
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  const updateLine = (idx: number, field: string, value: string) =>
    setLineItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId) {
      toast.error("Select a contact");
      return;
    }
    const validLines = lineItems.filter(
      (l) => l.description && l.quantity && l.unitPrice,
    );
    if (validLines.length === 0) {
      toast.error("Add at least one line item");
      return;
    }
    try {
      const items: InvoiceLineItem[] = validLines.map((l) => ({
        description: l.description,
        quantity: BigInt(l.quantity),
        unitPrice: BigInt(Math.round(Number.parseFloat(l.unitPrice) * 100)),
      }));
      const dueDateMs = new Date(dueDate).getTime();
      await createInvoice.mutateAsync({
        contactId: BigInt(contactId),
        dealId: null,
        lineItems: items,
        dueDate: BigInt(dueDateMs) * 1_000_000n,
      });
      toast.success("Invoice created");
      setOpen(false);
      setContactId("");
      setDueDate("");
      setLineItems([{ description: "", quantity: "", unitPrice: "" }]);
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  const handleStatusChange = async (id: bigint, status: InvoiceStatus) => {
    const paidAt =
      status === InvoiceStatus.paid ? BigInt(Date.now()) * 1_000_000n : null;
    try {
      await updateStatus.mutateAsync({ id, status, paidAt });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteInvoice.mutateAsync(id);
      toast.success("Invoice deleted");
    } catch {
      toast.error("Failed to delete invoice");
    }
  };

  if (isLoading) return <PageLoader label="Loading invoices…" />;

  const totalAmount = (inv: (typeof invoices)[0]) =>
    inv.lineItems.reduce((s, li) => s + li.quantity * li.unitPrice, 0n);

  const contactName = (id: bigint) =>
    contacts.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6" data-ocid="invoices.page">
      <PageHeader
        title="Invoices"
        description={`${invoices.length} total invoices`}
        action={{
          label: "New Invoice",
          onClick: () => setOpen(true),
          icon: <Plus className="size-4" />,
          "data-ocid": "invoices.add_button",
        }}
      />

      {invoices.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-8" />}
          title="No invoices yet"
          description="Create your first invoice to start billing customers."
          action={{
            label: "New Invoice",
            onClick: () => setOpen(true),
            "data-ocid": "invoices.empty_state.add_button",
          }}
          data-ocid="invoices.empty_state"
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden shadow-subtle">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Invoice #</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Issued</TableHead>
                <TableHead className="hidden lg:table-cell">Due</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-40">Change Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...invoices]
                .sort((a, b) => Number(b.issuedAt - a.issuedAt))
                .map((inv, i) => (
                  <TableRow
                    key={inv.id.toString()}
                    data-ocid={`invoices.item.${i + 1}`}
                  >
                    <TableCell className="font-mono text-xs">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {contactName(inv.contactId)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(inv.issuedAt)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(inv.dueDate)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {formatCurrency(totalAmount(inv))}
                    </TableCell>
                    <TableCell>
                      <StatusBadge type="invoice" value={inv.status} />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={inv.status}
                        onValueChange={(v) =>
                          handleStatusChange(inv.id, v as InvoiceStatus)
                        }
                      >
                        <SelectTrigger
                          className="h-7 text-xs"
                          data-ocid={`invoices.status.select.${i + 1}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive/60 hover:text-destructive"
                        onClick={() => handleDelete(inv.id)}
                        data-ocid={`invoices.delete_button.${i + 1}`}
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Invoice Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg" data-ocid="invoices.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">New Invoice</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Contact *</Label>
                <Select value={contactId} onValueChange={setContactId}>
                  <SelectTrigger data-ocid="invoices.contact.select">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((c) => (
                      <SelectItem key={c.id.toString()} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-due">Due date *</Label>
                <Input
                  id="inv-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  data-ocid="invoices.due_date.input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Line Items</Label>
              {lineItems.map((line, idx) => (
                <div
                  key={`inv-line-${line.description || idx}-${idx}`}
                  className="flex gap-2 items-end"
                >
                  <Input
                    placeholder="Description"
                    className="flex-1 h-8 text-xs"
                    value={line.description}
                    onChange={(e) =>
                      updateLine(idx, "description", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Qty"
                    type="number"
                    min="1"
                    className="w-14 h-8 text-xs"
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(idx, "quantity", e.target.value)
                    }
                  />
                  <Input
                    placeholder="$ each"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-20 h-8 text-xs"
                    value={line.unitPrice}
                    onChange={(e) =>
                      updateLine(idx, "unitPrice", e.target.value)
                    }
                  />
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => removeLine(idx)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={addLine}
              >
                + Add line
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="invoices.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createInvoice.isPending}
                data-ocid="invoices.submit_button"
              >
                {createInvoice.isPending ? "Creating…" : "Create Invoice"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
