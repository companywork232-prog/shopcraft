import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../components/EmptyState";
import { PageLoader } from "../components/LoadingSpinner";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import {
  useCompleteActivity,
  useCreateActivity,
  useDeleteActivity,
  useListActivities,
  useListContacts,
  useListDeals,
} from "../hooks/use-backend";
import { ActivityType, formatDate } from "../types";

const TYPE_OPTIONS = [
  { value: ActivityType.call, label: "Call" },
  { value: ActivityType.email, label: "Email" },
  { value: ActivityType.meeting, label: "Meeting" },
  { value: ActivityType.task, label: "Task" },
];

export default function ActivitiesPage() {
  const { data: activities = [], isLoading } = useListActivities();
  const { data: contacts = [] } = useListContacts();
  const { data: deals = [] } = useListDeals();
  const createActivity = useCreateActivity();
  const completeActivity = useCompleteActivity();
  const deleteActivity = useDeleteActivity();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    activityType: ActivityType.call,
    description: "",
    contactId: "",
    dealId: "",
    dueDate: "",
  });

  const sorted = [...activities].sort((a, b) => Number(a.dueDate - b.dueDate));
  const pending = sorted.filter((a) => !a.completedAt);
  const completed = sorted.filter((a) => !!a.completedAt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contactId) {
      toast.error("Select a contact");
      return;
    }
    try {
      const dueMs = new Date(form.dueDate).getTime();
      await createActivity.mutateAsync({
        activityType: form.activityType,
        description: form.description,
        contactId: BigInt(form.contactId),
        dealId: form.dealId ? BigInt(form.dealId) : null,
        dueDate: BigInt(dueMs) * 1_000_000n,
      });
      toast.success("Activity created");
      setOpen(false);
      setForm({
        activityType: ActivityType.call,
        description: "",
        contactId: "",
        dealId: "",
        dueDate: "",
      });
    } catch {
      toast.error("Failed to create activity");
    }
  };

  const handleComplete = async (id: bigint) => {
    try {
      await completeActivity.mutateAsync({
        id,
        completedAt: BigInt(Date.now()) * 1_000_000n,
      });
      toast.success("Activity marked complete");
    } catch {
      toast.error("Failed to complete activity");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteActivity.mutateAsync(id);
      toast.success("Activity deleted");
    } catch {
      toast.error("Failed to delete activity");
    }
  };

  if (isLoading) return <PageLoader label="Loading activities…" />;

  const contactName = (id: bigint) =>
    contacts.find((c) => c.id === id)?.name ?? "—";

  return (
    <div
      className="p-6 max-w-6xl mx-auto space-y-6"
      data-ocid="activities.page"
    >
      <PageHeader
        title="Activities"
        description={`${pending.length} pending, ${completed.length} completed`}
        action={{
          label: "New Activity",
          onClick: () => setOpen(true),
          icon: <Plus className="size-4" />,
          "data-ocid": "activities.add_button",
        }}
      />

      {activities.length === 0 ? (
        <EmptyState
          icon={<Clock className="size-8" />}
          title="No activities yet"
          description="Schedule calls, emails, meetings, and tasks to keep track of your customer interactions."
          action={{
            label: "New Activity",
            onClick: () => setOpen(true),
            "data-ocid": "activities.empty_state.add_button",
          }}
          data-ocid="activities.empty_state"
        />
      ) : (
        <div className="space-y-6">
          {/* Pending */}
          {pending.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Clock className="size-3.5" /> Pending ({pending.length})
              </h2>
              <div className="rounded-xl border border-border overflow-hidden shadow-subtle">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Contact
                      </TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead className="w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((a, i) => (
                      <TableRow
                        key={a.id.toString()}
                        data-ocid={`activities.pending.item.${i + 1}`}
                      >
                        <TableCell>
                          <StatusBadge type="activity" value={a.activityType} />
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">
                          {a.description}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {contactName(a.contactId)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(a.dueDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-emerald-600"
                              onClick={() => handleComplete(a.id)}
                              data-ocid={`activities.complete_button.${i + 1}`}
                              aria-label="Mark complete"
                            >
                              <CheckCircle2 className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive/60 hover:text-destructive"
                              onClick={() => handleDelete(a.id)}
                              data-ocid={`activities.delete_button.${i + 1}`}
                              aria-label="Delete"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <CheckCircle2 className="size-3.5" /> Completed (
                {completed.length})
              </h2>
              <div className="rounded-xl border border-border overflow-hidden opacity-70">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Contact
                      </TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completed.map((a, i) => (
                      <TableRow
                        key={a.id.toString()}
                        data-ocid={`activities.completed.item.${i + 1}`}
                      >
                        <TableCell>
                          <StatusBadge type="activity" value={a.activityType} />
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm line-through text-muted-foreground">
                          {a.description}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {contactName(a.contactId)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {a.completedAt ? formatDate(a.completedAt) : "—"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive/60 hover:text-destructive"
                            onClick={() => handleDelete(a.id)}
                            data-ocid={`activities.completed.delete_button.${i + 1}`}
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
            </div>
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" data-ocid="activities.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">New Activity</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={form.activityType}
                  onValueChange={(v) =>
                    setForm({ ...form, activityType: v as ActivityType })
                  }
                >
                  <SelectTrigger data-ocid="activities.type.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
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
                  <SelectTrigger data-ocid="activities.contact.select">
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
              <Label htmlFor="a-desc">Description *</Label>
              <Textarea
                id="a-desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                rows={2}
                data-ocid="activities.description.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="a-due">Due date *</Label>
                <Input
                  id="a-due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  required
                  data-ocid="activities.due_date.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Deal (optional)</Label>
                <Select
                  value={form.dealId}
                  onValueChange={(v) => setForm({ ...form, dealId: v })}
                >
                  <SelectTrigger data-ocid="activities.deal.select">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {deals.map((d) => (
                      <SelectItem key={d.id.toString()} value={d.id.toString()}>
                        {d.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="activities.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createActivity.isPending}
                data-ocid="activities.submit_button"
              >
                {createActivity.isPending ? "Creating…" : "Create Activity"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
