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
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../components/EmptyState";
import { PageLoader } from "../components/LoadingSpinner";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import {
  useCreateDeal,
  useDeleteDeal,
  useListContacts,
  useListDeals,
} from "../hooks/use-backend";
import { type Deal, DealStage, formatCurrency, formatDate } from "../types";

const STAGES = [
  { value: DealStage.prospect, label: "Prospect" },
  { value: DealStage.discovery, label: "Discovery" },
  { value: DealStage.proposal, label: "Proposal" },
  { value: DealStage.negotiation, label: "Negotiation" },
  { value: DealStage.closed_won, label: "Closed Won" },
  { value: DealStage.closed_lost, label: "Closed Lost" },
];

const STAGE_ORDER = [
  "prospect",
  "discovery",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
];

function DealCard({
  deal,
  index,
  contacts,
  onDelete,
}: {
  deal: Deal;
  index: number;
  contacts: { id: bigint; name: string }[];
  onDelete: (id: bigint) => void;
}) {
  const contact = contacts.find((c) => c.id === deal.contactId);
  return (
    <div
      className="bg-card border border-border rounded-xl p-4 shadow-subtle hover:shadow-elevated transition-smooth"
      data-ocid={`deals.item.${index}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-semibold text-sm text-foreground truncate leading-tight">
          {deal.title}
        </p>
        <button
          type="button"
          onClick={() => onDelete(deal.id)}
          className="shrink-0 size-6 flex items-center justify-center rounded text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-smooth"
          data-ocid={`deals.delete_button.${index}`}
          aria-label="Delete deal"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <p className="font-display font-bold text-lg text-foreground">
        {formatCurrency(deal.value)}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {contact?.name ?? "Unknown"} · Close {formatDate(deal.closeDate)}
      </p>
      <p className="text-xs text-muted-foreground">
        {Number(deal.probability)}% probability
      </p>
    </div>
  );
}

export default function DealsPage() {
  const { data: deals = [], isLoading } = useListDeals();
  const { data: contacts = [] } = useListContacts();
  const createDeal = useCreateDeal();
  const deleteDeal = useDeleteDeal();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    value: "",
    stage: DealStage.prospect,
    contactId: "",
    probability: "50",
    closeDate: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contactId) {
      toast.error("Select a contact");
      return;
    }
    try {
      const closeMs = new Date(form.closeDate).getTime();
      await createDeal.mutateAsync({
        title: form.title,
        value: BigInt(Math.round(Number.parseFloat(form.value) * 100)),
        stage: form.stage,
        contactId: BigInt(form.contactId),
        probability: BigInt(form.probability),
        closeDate: BigInt(closeMs) * 1_000_000n,
        notes: form.notes,
      });
      toast.success("Deal created");
      setOpen(false);
      setForm({
        title: "",
        value: "",
        stage: DealStage.prospect,
        contactId: "",
        probability: "50",
        closeDate: "",
        notes: "",
      });
    } catch {
      toast.error("Failed to create deal");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteDeal.mutateAsync(id);
      toast.success("Deal deleted");
    } catch {
      toast.error("Failed to delete deal");
    }
  };

  if (isLoading) return <PageLoader label="Loading deals…" />;

  const contactList = contacts.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" data-ocid="deals.page">
      <PageHeader
        title="Deals"
        description={`${deals.length} total deals`}
        action={{
          label: "New Deal",
          onClick: () => setOpen(true),
          "data-ocid": "deals.add_button",
        }}
      />

      {/* Kanban board */}
      {deals.length === 0 ? (
        <EmptyState
          title="No deals yet"
          description="Create your first deal to start tracking your sales pipeline."
          action={{
            label: "New Deal",
            onClick: () => setOpen(true),
            "data-ocid": "deals.empty_state.add_button",
          }}
          data-ocid="deals.empty_state"
        />
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STAGE_ORDER.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage);
              const stageLabels: Record<string, string> = {
                prospect: "Prospect",
                discovery: "Discovery",
                proposal: "Proposal",
                negotiation: "Negotiation",
                closed_won: "Closed Won",
                closed_lost: "Closed Lost",
              };
              return (
                <div
                  key={stage}
                  className="w-64 shrink-0"
                  data-ocid={`deals.stage.${stage}.column`}
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className="font-display font-semibold text-sm text-foreground">
                      {stageLabels[stage]}
                    </p>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {stageDeals.map((d, i) => (
                      <DealCard
                        key={d.id.toString()}
                        deal={d}
                        index={i + 1}
                        contacts={contactList}
                        onDelete={handleDelete}
                      />
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">
                          No deals
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" data-ocid="deals.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">New Deal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="d-title">Deal title *</Label>
              <Input
                id="d-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                data-ocid="deals.title.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="d-value">Value ($) *</Label>
                <Input
                  id="d-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                  data-ocid="deals.value.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-prob">Probability (%)</Label>
                <Input
                  id="d-prob"
                  type="number"
                  min="0"
                  max="100"
                  value={form.probability}
                  onChange={(e) =>
                    setForm({ ...form, probability: e.target.value })
                  }
                  data-ocid="deals.probability.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Stage</Label>
                <Select
                  value={form.stage}
                  onValueChange={(v) =>
                    setForm({ ...form, stage: v as DealStage })
                  }
                >
                  <SelectTrigger data-ocid="deals.stage.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Contact *</Label>
                <Select
                  value={form.contactId}
                  onValueChange={(v) => setForm({ ...form, contactId: v })}
                >
                  <SelectTrigger data-ocid="deals.contact.select">
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
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-close">Close date *</Label>
              <Input
                id="d-close"
                type="date"
                value={form.closeDate}
                onChange={(e) =>
                  setForm({ ...form, closeDate: e.target.value })
                }
                required
                data-ocid="deals.close_date.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-notes">Notes</Label>
              <Textarea
                id="d-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                data-ocid="deals.notes.textarea"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="deals.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createDeal.isPending}
                data-ocid="deals.submit_button"
              >
                {createDeal.isPending ? "Creating…" : "Create Deal"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
