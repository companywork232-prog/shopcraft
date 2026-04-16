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
import { useNavigate } from "@tanstack/react-router";
import { Plus, Search, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../components/EmptyState";
import { PageLoader } from "../components/LoadingSpinner";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import {
  useCreateContact,
  useDeleteContact,
  useListContacts,
} from "../hooks/use-backend";
import { type Contact, ContactStatus } from "../types";

const STATUS_OPTIONS = [
  { value: ContactStatus.lead, label: "Lead" },
  { value: ContactStatus.prospect, label: "Prospect" },
  { value: ContactStatus.customer, label: "Customer" },
];

function ContactRow({
  contact,
  index,
  onDelete,
}: { contact: Contact; index: number; onDelete: (id: bigint) => void }) {
  const navigate = useNavigate();
  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/40"
      onClick={() =>
        navigate({
          to: "/crm/contacts/$id",
          params: { id: contact.id.toString() },
        })
      }
      data-ocid={`contacts.item.${index}`}
    >
      <TableCell className="font-medium">{contact.name}</TableCell>
      <TableCell className="text-muted-foreground">{contact.email}</TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        {contact.company}
      </TableCell>
      <TableCell className="hidden lg:table-cell text-muted-foreground">
        {contact.phone}
      </TableCell>
      <TableCell>
        <StatusBadge type="contact" value={contact.status} />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(contact.id);
          }}
          data-ocid={`contacts.delete_button.${index}`}
          aria-label="Delete contact"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function ContactsPage() {
  const { data: contacts = [], isLoading } = useListContacts();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: ContactStatus.lead,
    notes: "",
  });

  const filtered = contacts.filter((c) =>
    [c.name, c.email, c.company].some((f) =>
      f.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createContact.mutateAsync(form);
      toast.success("Contact created");
      setOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: ContactStatus.lead,
        notes: "",
      });
    } catch {
      toast.error("Failed to create contact");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteContact.mutateAsync(id);
      toast.success("Contact deleted");
    } catch {
      toast.error("Failed to delete contact");
    }
  };

  if (isLoading) return <PageLoader label="Loading contacts…" />;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6" data-ocid="contacts.page">
      <PageHeader
        title="Contacts"
        description={`${contacts.length} total contacts`}
        action={{
          label: "Add Contact",
          onClick: () => setOpen(true),
          icon: <Plus className="size-4" />,
          "data-ocid": "contacts.add_button",
        }}
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search contacts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="contacts.search_input"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<User className="size-8" />}
          title={search ? "No contacts match your search" : "No contacts yet"}
          description={
            search
              ? "Try a different search term."
              : "Add your first contact to start managing relationships."
          }
          action={
            !search
              ? {
                  label: "Add Contact",
                  onClick: () => setOpen(true),
                  "data-ocid": "contacts.empty_state.add_button",
                }
              : undefined
          }
          data-ocid="contacts.empty_state"
        />
      ) : (
        <div
          className="rounded-xl border border-border overflow-hidden shadow-subtle"
          data-ocid="contacts.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c, i) => (
                <ContactRow
                  key={c.id.toString()}
                  contact={c}
                  index={i + 1}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" data-ocid="contacts.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">New Contact</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="c-name">Full name *</Label>
                <Input
                  id="c-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  data-ocid="contacts.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-email">Email *</Label>
                <Input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  data-ocid="contacts.email.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-phone">Phone</Label>
                <Input
                  id="c-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  data-ocid="contacts.phone.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-company">Company</Label>
                <Input
                  id="c-company"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  data-ocid="contacts.company.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm({ ...form, status: v as ContactStatus })
                  }
                >
                  <SelectTrigger data-ocid="contacts.status.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="c-notes">Notes</Label>
                <Textarea
                  id="c-notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  data-ocid="contacts.notes.textarea"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="contacts.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createContact.isPending}
                data-ocid="contacts.submit_button"
              >
                {createContact.isPending ? "Creating…" : "Create Contact"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
