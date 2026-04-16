import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  ActivityType,
  ContactId,
  ContactStatus,
  DealId,
  DealStage,
  EntityId,
  InvoiceLineItem,
  InvoiceStatus,
  ProductId,
  PurchaseLineItem,
  PurchaseOrderId,
  PurchaseOrderStatus,
  Role,
  Timestamp,
  UserId,
} from "../backend";

// ─── Shared actor hook ───────────────────────────────────────────────────────
function useBackendActor() {
  return useActor(createActor);
}

// ─── CRM: Contacts ──────────────────────────────────────────────────────────

export function useListContacts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listContacts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetContact(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["contact", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getContact(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 30_000,
  });
}

export function useCreateContact() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      email: string;
      phone: string;
      company: string;
      status: ContactStatus;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createContact(
        args.name,
        args.email,
        args.phone,
        args.company,
        args.status,
        args.notes,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useUpdateContact() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: ContactId;
      name: string;
      email: string;
      phone: string;
      company: string;
      status: ContactStatus;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateContact(
        args.id,
        args.name,
        args.email,
        args.phone,
        args.company,
        args.status,
        args.notes,
      );
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["contacts"] });
      qc.invalidateQueries({ queryKey: ["contact", v.id.toString()] });
    },
  });
}

export function useDeleteContact() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: ContactId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteContact(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

// ─── CRM: Deals ─────────────────────────────────────────────────────────────

export function useListDeals() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDeals();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetDeal(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["deal", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getDeal(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateDeal() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      title: string;
      value: bigint;
      stage: DealStage;
      contactId: ContactId;
      probability: bigint;
      closeDate: Timestamp;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createDeal(
        args.title,
        args.value,
        args.stage,
        args.contactId,
        args.probability,
        args.closeDate,
        args.notes,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deals"] }),
  });
}

export function useUpdateDeal() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: DealId;
      title: string;
      value: bigint;
      stage: DealStage;
      contactId: ContactId;
      probability: bigint;
      closeDate: Timestamp;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateDeal(
        args.id,
        args.title,
        args.value,
        args.stage,
        args.contactId,
        args.probability,
        args.closeDate,
        args.notes,
      );
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["deals"] });
      qc.invalidateQueries({ queryKey: ["deal", v.id.toString()] });
    },
  });
}

export function useDeleteDeal() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: DealId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteDeal(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deals"] }),
  });
}

// ─── CRM: Activities ────────────────────────────────────────────────────────

export function useListActivities() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActivities();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCreateActivity() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      activityType: ActivityType;
      description: string;
      contactId: ContactId;
      dealId: DealId | null;
      dueDate: Timestamp;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createActivity(
        args.activityType,
        args.description,
        args.contactId,
        args.dealId,
        args.dueDate,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useCompleteActivity() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; completedAt: Timestamp }) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeActivity(args.id, args.completedAt);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useDeleteActivity() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteActivity(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });
}

// ─── ERP: Products ───────────────────────────────────────────────────────────

export function useListProducts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useGetLowStockProducts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["low-stock"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLowStockProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useCreateProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      sku: string;
      costPrice: bigint;
      sellingPrice: bigint;
      stockQuantity: bigint;
      reorderThreshold: bigint;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProduct(
        args.name,
        args.sku,
        args.costPrice,
        args.sellingPrice,
        args.stockQuantity,
        args.reorderThreshold,
        args.category,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: ProductId;
      name: string;
      sku: string;
      costPrice: bigint;
      sellingPrice: bigint;
      stockQuantity: bigint;
      reorderThreshold: bigint;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(
        args.id,
        args.name,
        args.sku,
        args.costPrice,
        args.sellingPrice,
        args.stockQuantity,
        args.reorderThreshold,
        args.category,
      );
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", v.id.toString()] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: ProductId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useAdjustStock() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: ProductId; delta: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.adjustStock(args.id, args.delta);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["low-stock"] });
    },
  });
}

// ─── ERP: Purchase Orders ────────────────────────────────────────────────────

export function useListPurchaseOrders() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["purchase-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPurchaseOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCreatePurchaseOrder() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      vendor: string;
      lineItems: Array<PurchaseLineItem>;
      expectedDelivery: Timestamp;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPurchaseOrder(
        args.vendor,
        args.lineItems,
        args.expectedDelivery,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-orders"] }),
  });
}

export function useUpdatePurchaseOrderStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: PurchaseOrderId;
      status: PurchaseOrderStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePurchaseOrderStatus(args.id, args.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-orders"] }),
  });
}

// ─── ERP: Invoices ───────────────────────────────────────────────────────────

export function useListInvoices() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInvoices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCreateInvoice() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      contactId: EntityId;
      dealId: EntityId | null;
      lineItems: Array<InvoiceLineItem>;
      dueDate: Timestamp;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInvoice(
        args.contactId,
        args.dealId,
        args.lineItems,
        args.dueDate,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

export function useUpdateInvoiceStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      status: InvoiceStatus;
      paidAt: Timestamp | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateInvoiceStatus(args.id, args.status, args.paidAt);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

export function useDeleteInvoice() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteInvoice(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

// ─── ERP: Financials ─────────────────────────────────────────────────────────

export function useGetFinancialSummary() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["financial-summary"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFinancialSummary();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Admin: Roles ────────────────────────────────────────────────────────────

export function useGetMyRole() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["my-role"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyRole();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useListUserRoles() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUserRoles();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useAssignRole() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { userId: UserId; role: Role }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignRole(args.userId, args.role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-roles"] }),
  });
}

export function useRemoveRole() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: UserId) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeRole(userId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-roles"] }),
  });
}

export function useBootstrapFirstAdmin() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.bootstrapFirstAdmin();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-role"] });
      qc.invalidateQueries({ queryKey: ["user-roles"] });
    },
  });
}
