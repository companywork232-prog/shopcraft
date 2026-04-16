import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Principal } from "@icp-sdk/core/principal";
import { Settings, ShieldCheck, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageLoader } from "../components/LoadingSpinner";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../hooks/use-auth";
import {
  useAssignRole,
  useBootstrapFirstAdmin,
  useListUserRoles,
  useRemoveRole,
} from "../hooks/use-backend";
import { Role } from "../types";

const ROLE_OPTIONS = [
  {
    value: Role.admin,
    label: "Admin",
    description: "Full access to all features",
  },
  {
    value: Role.manager,
    label: "Manager",
    description: "CRM + ERP access, no admin panel",
  },
  { value: Role.sales_rep, label: "Sales Rep", description: "CRM access only" },
  { value: Role.finance, label: "Finance", description: "ERP access only" },
];

const ROLE_COLORS: Record<Role, string> = {
  [Role.admin]: "bg-destructive/10 text-destructive border-destructive/20",
  [Role.manager]: "bg-primary/10 text-primary border-primary/20",
  [Role.sales_rep]:
    "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40",
  [Role.finance]:
    "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40",
};

export default function AdminPage() {
  const { role: myRole } = useAuth();
  const { data: userRoles = [], isLoading } = useListUserRoles();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  const bootstrapAdmin = useBootstrapFirstAdmin();
  const [newPrincipal, setNewPrincipal] = useState("");
  const [newRole, setNewRole] = useState<Role>(Role.sales_rep);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrincipal.trim()) {
      toast.error("Enter a principal ID");
      return;
    }
    try {
      const userId = Principal.fromText(newPrincipal.trim());
      await assignRole.mutateAsync({ userId, role: newRole });
      toast.success("Role assigned successfully");
      setNewPrincipal("");
    } catch {
      toast.error("Failed to assign role — check the principal ID format");
    }
  };

  const handleRemove = async (userId: Principal) => {
    try {
      await removeRole.mutateAsync(userId);
      toast.success("Role removed");
    } catch {
      toast.error("Failed to remove role");
    }
  };

  const handleBootstrap = async () => {
    try {
      await bootstrapAdmin.mutateAsync();
      toast.success("You are now the first admin!");
    } catch {
      toast.error("Bootstrap failed — admin may already exist");
    }
  };

  if (isLoading) return <PageLoader label="Loading admin panel…" />;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6" data-ocid="admin.page">
      <PageHeader
        title="Admin Panel"
        description="Manage user roles and system settings"
      />

      {/* Bootstrap card shown when no roles exist */}
      {userRoles.length === 0 && (
        <Card
          className="border-amber-300 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/10 shadow-subtle"
          data-ocid="admin.bootstrap.card"
        >
          <CardContent className="p-6 flex items-start gap-4">
            <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-foreground mb-1">
                First-time Setup
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                No admin roles exist yet. Bootstrap yourself as the first admin
                to get started.
              </p>
              <Button
                onClick={handleBootstrap}
                disabled={bootstrapAdmin.isPending}
                data-ocid="admin.bootstrap.button"
              >
                {bootstrapAdmin.isPending
                  ? "Bootstrapping…"
                  : "Bootstrap as Admin"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assign Role Form */}
        <Card className="shadow-subtle" data-ocid="admin.assign_role.card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <UserPlus className="size-4 text-muted-foreground" />
              Assign Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssign} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ar-principal">Principal ID *</Label>
                <Input
                  id="ar-principal"
                  value={newPrincipal}
                  onChange={(e) => setNewPrincipal(e.target.value)}
                  placeholder="aaaaa-bbbbb-ccccc-ddddd-eee"
                  className="font-mono text-xs"
                  data-ocid="admin.principal.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={newRole}
                  onValueChange={(v) => setNewRole(v as Role)}
                >
                  <SelectTrigger data-ocid="admin.role.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <div>
                          <p className="font-medium">{o.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {o.description}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={assignRole.isPending}
                data-ocid="admin.assign_button"
              >
                {assignRole.isPending ? "Assigning…" : "Assign Role"}
              </Button>
            </form>

            {/* Role reference */}
            <div className="mt-6 pt-4 border-t border-border space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Role Reference
              </p>
              {ROLE_OPTIONS.map((r) => (
                <div key={r.value} className="flex items-start gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${ROLE_COLORS[r.value]}`}
                  >
                    {r.label}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Roles Table */}
        <Card
          className="lg:col-span-2 shadow-subtle"
          data-ocid="admin.users.card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Settings className="size-4 text-muted-foreground" />
              Current User Roles ({userRoles.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {userRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No roles assigned yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Principal ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.map((ur, i) => (
                    <TableRow
                      key={ur.userId.toText()}
                      data-ocid={`admin.user.item.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                        {ur.userId.toText()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[ur.role]}`}
                        >
                          {ur.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        {myRole === Role.admin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemove(ur.userId)}
                            data-ocid={`admin.remove_role.button.${i + 1}`}
                            aria-label="Remove role"
                          >
                            <X className="size-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
