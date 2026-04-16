import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Briefcase,
  Building2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { PageLoader } from "../components/LoadingSpinner";
import { StatusBadge } from "../components/StatusBadge";
import {
  useGetContact,
  useListActivities,
  useListDeals,
} from "../hooks/use-backend";
import { formatCurrency, formatDate } from "../types";

export default function ContactDetailPage() {
  const { id } = useParams({ from: "/crm/contacts/$id" });
  const navigate = useNavigate();
  const contactId = BigInt(id);
  const { data: contact, isLoading } = useGetContact(contactId);
  const { data: deals = [] } = useListDeals();
  const { data: activities = [] } = useListActivities();

  const contactDeals = deals.filter((d) => d.contactId === contactId);
  const contactActivities = activities.filter((a) => a.contactId === contactId);

  if (isLoading) return <PageLoader label="Loading contact…" />;
  if (!contact)
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Contact not found.</p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/crm/contacts" })}
          className="mt-4"
        >
          Back to Contacts
        </Button>
      </div>
    );

  return (
    <div
      className="p-6 max-w-5xl mx-auto space-y-6"
      data-ocid="contact_detail.page"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/crm/contacts" })}
          className="gap-1.5"
          data-ocid="contact_detail.back.link"
        >
          <ArrowLeft className="size-4" /> Contacts
        </Button>
      </div>

      {/* Header card */}
      <Card className="shadow-subtle">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="size-16 rounded-2xl gradient-primary flex items-center justify-center shrink-0">
              <User className="size-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display font-bold text-2xl text-foreground">
                    {contact.name}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Building2 className="size-3.5" /> {contact.company || "—"}
                  </p>
                </div>
                <StatusBadge type="contact" value={contact.status} />
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  data-ocid="contact_detail.email.link"
                >
                  <Mail className="size-4" /> {contact.email}
                </a>
                {contact.phone && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="size-4" /> {contact.phone}
                  </span>
                )}
              </div>
              {contact.notes && (
                <p className="mt-3 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {contact.notes}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deals */}
        <Card className="shadow-subtle" data-ocid="contact_detail.deals.card">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Briefcase className="size-4 text-muted-foreground" /> Deals (
              {contactDeals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contactDeals.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No deals associated.
              </p>
            ) : (
              contactDeals.map((d, i) => (
                <div
                  key={d.id.toString()}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                  data-ocid={`contact_detail.deal.item.${i + 1}`}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{d.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Close: {formatDate(d.closeDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-medium text-sm">
                      {formatCurrency(d.value)}
                    </span>
                    <StatusBadge type="deal" value={d.stage} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Activities */}
        <Card
          className="shadow-subtle"
          data-ocid="contact_detail.activities.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Activity className="size-4 text-muted-foreground" /> Activities (
              {contactActivities.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contactActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No activities recorded.
              </p>
            ) : (
              contactActivities.map((a, i) => (
                <div
                  key={a.id.toString()}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/40"
                  data-ocid={`contact_detail.activity.item.${i + 1}`}
                >
                  <StatusBadge type="activity" value={a.activityType} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{a.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {formatDate(a.dueDate)}
                    </p>
                  </div>
                  {a.completedAt && (
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      Done
                    </Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
