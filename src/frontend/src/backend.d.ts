import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FinancialSummary {
    grossMargin: bigint;
    totalExpenses: bigint;
    outstandingReceivables: bigint;
    cashBalance: bigint;
    inventoryValue: bigint;
    totalRevenue: bigint;
}
export type Timestamp = bigint;
export interface Contact {
    id: ContactId;
    status: ContactStatus;
    name: string;
    createdAt: Timestamp;
    email: string;
    company: string;
    notes: string;
    phone: string;
}
export type PurchaseOrderId = bigint;
export interface UserRole {
    userId: UserId;
    role: Role;
}
export type EntityId = bigint;
export interface Invoice {
    id: InvoiceId;
    status: InvoiceStatus;
    lineItems: Array<InvoiceLineItem>;
    dueDate: Timestamp;
    dealId?: EntityId;
    invoiceNumber: string;
    contactId: EntityId;
    issuedAt: Timestamp;
    paidAt?: Timestamp;
}
export type UserId = Principal;
export interface Activity {
    id: ActivityId;
    completedAt?: Timestamp;
    activityType: ActivityType;
    createdAt: Timestamp;
    createdBy: UserId;
    dueDate: Timestamp;
    description: string;
    dealId?: DealId;
    contactId: ContactId;
}
export type ActivityId = bigint;
export interface Deal {
    id: DealId;
    probability: bigint;
    closeDate: Timestamp;
    title: string;
    value: bigint;
    createdAt: Timestamp;
    stage: DealStage;
    notes: string;
    contactId: ContactId;
}
export type InvoiceId = bigint;
export interface PurchaseLineItem {
    productId: ProductId;
    quantity: bigint;
    unitCost: bigint;
}
export type ProductId = bigint;
export interface PurchaseOrder {
    id: PurchaseOrderId;
    status: PurchaseOrderStatus;
    lineItems: Array<PurchaseLineItem>;
    createdAt: Timestamp;
    vendor: string;
    expectedDelivery: Timestamp;
}
export type ContactId = bigint;
export type DealId = bigint;
export interface InvoiceLineItem {
    description: string;
    quantity: bigint;
    unitPrice: bigint;
}
export interface Product {
    id: ProductId;
    sku: string;
    stockQuantity: bigint;
    name: string;
    createdAt: Timestamp;
    sellingPrice: bigint;
    category: string;
    costPrice: bigint;
    reorderThreshold: bigint;
}
export enum ActivityType {
    call = "call",
    task = "task",
    email = "email",
    meeting = "meeting"
}
export enum ContactStatus {
    customer = "customer",
    lead = "lead",
    prospect = "prospect"
}
export enum DealStage {
    closed_won = "closed_won",
    discovery = "discovery",
    prospect = "prospect",
    closed_lost = "closed_lost",
    proposal = "proposal",
    negotiation = "negotiation"
}
export enum InvoiceStatus {
    cancelled = "cancelled",
    paid = "paid",
    sent = "sent",
    overdue = "overdue",
    draft = "draft"
}
export enum PurchaseOrderStatus {
    cancelled = "cancelled",
    submitted = "submitted",
    draft = "draft",
    received = "received"
}
export enum Role {
    manager = "manager",
    admin = "admin",
    finance = "finance",
    sales_rep = "sales_rep"
}
export interface backendInterface {
    adjustStock(id: ProductId, delta: bigint): Promise<Product | null>;
    assignRole(userId: UserId, role: Role): Promise<void>;
    bootstrapFirstAdmin(): Promise<void>;
    completeActivity(id: ActivityId, completedAt: Timestamp): Promise<{
        __kind__: "ok";
        ok: Activity | null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createActivity(activityType: ActivityType, description: string, contactId: ContactId, dealId: DealId | null, dueDate: Timestamp): Promise<{
        __kind__: "ok";
        ok: Activity;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createContact(name: string, email: string, phone: string, company: string, status: ContactStatus, notes: string): Promise<{
        __kind__: "ok";
        ok: Contact;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createDeal(title: string, value: bigint, stage: DealStage, contactId: ContactId, probability: bigint, closeDate: Timestamp, notes: string): Promise<{
        __kind__: "ok";
        ok: Deal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createInvoice(contactId: EntityId, dealId: EntityId | null, lineItems: Array<InvoiceLineItem>, dueDate: Timestamp): Promise<Invoice>;
    createProduct(name: string, sku: string, costPrice: bigint, sellingPrice: bigint, stockQuantity: bigint, reorderThreshold: bigint, category: string): Promise<Product>;
    createPurchaseOrder(vendor: string, lineItems: Array<PurchaseLineItem>, expectedDelivery: Timestamp): Promise<PurchaseOrder>;
    deleteActivity(id: ActivityId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteContact(id: ContactId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteDeal(id: DealId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteInvoice(id: InvoiceId): Promise<boolean>;
    deleteProduct(id: ProductId): Promise<boolean>;
    filterActivities(contactIdFilter: ContactId | null, dealIdFilter: DealId | null): Promise<Array<Activity>>;
    filterDeals(stageFilter: DealStage | null, contactIdFilter: ContactId | null): Promise<Array<Deal>>;
    getActivity(id: ActivityId): Promise<Activity | null>;
    getContact(id: ContactId): Promise<Contact | null>;
    getDeal(id: DealId): Promise<Deal | null>;
    getFinancialSummary(): Promise<FinancialSummary>;
    getInvoice(id: InvoiceId): Promise<Invoice | null>;
    getLowStockProducts(): Promise<Array<Product>>;
    getMyRole(): Promise<Role | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getPurchaseOrder(id: PurchaseOrderId): Promise<PurchaseOrder | null>;
    getRevenueByPeriod(months: bigint): Promise<Array<[string, bigint]>>;
    listActivities(): Promise<Array<Activity>>;
    listContacts(): Promise<Array<Contact>>;
    listDeals(): Promise<Array<Deal>>;
    listInvoices(): Promise<Array<Invoice>>;
    listProducts(): Promise<Array<Product>>;
    listPurchaseOrders(): Promise<Array<PurchaseOrder>>;
    listUserRoles(): Promise<Array<UserRole>>;
    removeRole(userId: UserId): Promise<void>;
    searchContacts(nameFilter: string | null, emailFilter: string | null, companyFilter: string | null, statusFilter: ContactStatus | null): Promise<Array<Contact>>;
    searchProducts(nameFilter: string | null, categoryFilter: string | null, lowStockOnly: boolean): Promise<Array<Product>>;
    updateContact(id: ContactId, name: string, email: string, phone: string, company: string, status: ContactStatus, notes: string): Promise<{
        __kind__: "ok";
        ok: Contact | null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateDeal(id: DealId, title: string, value: bigint, stage: DealStage, contactId: ContactId, probability: bigint, closeDate: Timestamp, notes: string): Promise<{
        __kind__: "ok";
        ok: Deal | null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateInvoiceStatus(id: InvoiceId, status: InvoiceStatus, paidAt: Timestamp | null): Promise<Invoice | null>;
    updateProduct(id: ProductId, name: string, sku: string, costPrice: bigint, sellingPrice: bigint, stockQuantity: bigint, reorderThreshold: bigint, category: string): Promise<Product | null>;
    updatePurchaseOrderStatus(id: PurchaseOrderId, status: PurchaseOrderStatus): Promise<PurchaseOrder | null>;
}
