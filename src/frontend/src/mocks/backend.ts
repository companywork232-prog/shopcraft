import type { backendInterface } from "../backend";
import {
  ActivityType,
  ContactStatus,
  DealStage,
  InvoiceStatus,
  PurchaseOrderStatus,
  Role,
} from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const mockPrincipal: Principal = {
  toText: () => "aaaaa-aa",
  toUint8Array: () => new Uint8Array(),
  compareTo: () => 0,
  isAnonymous: () => false,
  _isPrincipal: true,
} as unknown as Principal;

export const mockBackend: backendInterface = {
  async listContacts() {
    return [
      { id: BigInt(1), name: "Sarah Chen", email: "sarah.chen@acme.com", phone: "+1 415-555-0101", company: "Acme Corp", status: ContactStatus.customer, notes: "Key account", createdAt: BigInt(Date.now()) * 1_000_000n },
      { id: BigInt(2), name: "Marcus Williams", email: "m.williams@techvision.io", phone: "+1 650-555-0182", company: "TechVision", status: ContactStatus.prospect, notes: "Demo scheduled", createdAt: BigInt(Date.now()) * 1_000_000n },
      { id: BigInt(3), name: "Elena Rodrigues", email: "elena@globalstart.com", phone: "+1 212-555-0143", company: "GlobalStart", status: ContactStatus.lead, notes: "Inbound lead", createdAt: BigInt(Date.now()) * 1_000_000n },
    ];
  },
  async getContact() { return null; },
  async createContact(name, email, phone, company, status, notes) {
    return { __kind__: "ok", ok: { id: BigInt(99), name, email, phone, company, status, notes, createdAt: BigInt(Date.now()) * 1_000_000n } };
  },
  async updateContact() { return { __kind__: "ok", ok: null }; },
  async deleteContact() { return { __kind__: "ok", ok: true }; },
  async searchContacts() {
    return [
      { id: BigInt(1), name: "Sarah Chen", email: "sarah.chen@acme.com", phone: "+1 415-555-0101", company: "Acme Corp", status: ContactStatus.customer, notes: "Key account", createdAt: BigInt(Date.now()) * 1_000_000n },
    ];
  },
  async listDeals() {
    return [
      { id: BigInt(1), title: "Acme Corp Enterprise License", value: BigInt(85000), stage: DealStage.proposal, contactId: BigInt(1), probability: BigInt(70), closeDate: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000) * 1_000_000n, notes: "Renewal + expansion", createdAt: BigInt(Date.now()) * 1_000_000n },
      { id: BigInt(2), title: "TechVision Platform Integration", value: BigInt(42000), stage: DealStage.negotiation, contactId: BigInt(2), probability: BigInt(85), closeDate: BigInt(Date.now() + 14 * 24 * 60 * 60 * 1000) * 1_000_000n, notes: "In final review", createdAt: BigInt(Date.now()) * 1_000_000n },
      { id: BigInt(3), title: "GlobalStart Starter Package", value: BigInt(12500), stage: DealStage.discovery, contactId: BigInt(3), probability: BigInt(30), closeDate: BigInt(Date.now() + 60 * 24 * 60 * 60 * 1000) * 1_000_000n, notes: "Needs budget approval", createdAt: BigInt(Date.now()) * 1_000_000n },
      { id: BigInt(4), title: "Nexus Media Annual Plan", value: BigInt(28000), stage: DealStage.closed_won, contactId: BigInt(1), probability: BigInt(100), closeDate: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * 1_000_000n, notes: "Closed successfully", createdAt: BigInt(Date.now()) * 1_000_000n },
    ];
  },
  async getDeal() { return null; },
  async filterDeals() { return []; },
  async createDeal(title, value, stage, contactId, probability, closeDate, notes) {
    return { __kind__: "ok", ok: { id: BigInt(99), title, value, stage, contactId, probability, closeDate, notes, createdAt: BigInt(Date.now()) * 1_000_000n } };
  },
  async updateDeal() { return { __kind__: "ok", ok: null }; },
  async deleteDeal() { return { __kind__: "ok", ok: true }; },
  async listActivities() {
    return [
      { id: BigInt(1), activityType: ActivityType.call, description: "Follow-up call with Acme procurement team", contactId: BigInt(1), dueDate: BigInt(Date.now() + 2 * 24 * 60 * 60 * 1000) * 1_000_000n, createdAt: BigInt(Date.now()) * 1_000_000n, createdBy: mockPrincipal },
      { id: BigInt(2), activityType: ActivityType.meeting, description: "Product demo for TechVision", contactId: BigInt(2), dueDate: BigInt(Date.now() + 1 * 24 * 60 * 60 * 1000) * 1_000_000n, createdAt: BigInt(Date.now()) * 1_000_000n, createdBy: mockPrincipal },
    ];
  },
  async getActivity() { return null; },
  async filterActivities() { return []; },
  async createActivity(activityType, description, contactId, _dealId, dueDate) {
    return { __kind__: "ok", ok: { id: BigInt(99), activityType, description, contactId, dueDate, createdAt: BigInt(Date.now()) * 1_000_000n, createdBy: mockPrincipal } };
  },
  async completeActivity() { return { __kind__: "ok", ok: null }; },
  async deleteActivity() { return { __kind__: "ok", ok: true }; },
  async listProducts() {
    return [
      { id: BigInt(1), name: "Enterprise Suite Pro", sku: "ESP-001", costPrice: BigInt(20000), sellingPrice: BigInt(49900), stockQuantity: BigInt(120), reorderThreshold: BigInt(20), category: "Software", createdAt: BigInt(Date.now()) * 1_000_000n },
      { id: BigInt(2), name: "Analytics Module", sku: "ANL-002", costPrice: BigInt(5000), sellingPrice: BigInt(14900), stockQuantity: BigInt(8), reorderThreshold: BigInt(10), category: "Add-ons", createdAt: BigInt(Date.now()) * 1_000_000n },
      { id: BigInt(3), name: "Support Package Gold", sku: "SPG-003", costPrice: BigInt(8000), sellingPrice: BigInt(19900), stockQuantity: BigInt(55), reorderThreshold: BigInt(15), category: "Services", createdAt: BigInt(Date.now()) * 1_000_000n },
    ];
  },
  async getProduct() { return null; },
  async searchProducts() { return []; },
  async createProduct(name, sku, costPrice, sellingPrice, stockQuantity, reorderThreshold, category) {
    return { id: BigInt(99), name, sku, costPrice, sellingPrice, stockQuantity, reorderThreshold, category, createdAt: BigInt(Date.now()) * 1_000_000n };
  },
  async updateProduct() { return null; },
  async deleteProduct() { return true; },
  async adjustStock() { return null; },
  async getLowStockProducts() {
    return [
      { id: BigInt(2), name: "Analytics Module", sku: "ANL-002", costPrice: BigInt(5000), sellingPrice: BigInt(14900), stockQuantity: BigInt(8), reorderThreshold: BigInt(10), category: "Add-ons", createdAt: BigInt(Date.now()) * 1_000_000n },
    ];
  },
  async listPurchaseOrders() {
    return [
      { id: BigInt(1), vendor: "CloudHost Inc.", lineItems: [{ productId: BigInt(1), quantity: BigInt(10), unitCost: BigInt(20000) }], expectedDelivery: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000) * 1_000_000n, status: PurchaseOrderStatus.submitted, createdAt: BigInt(Date.now()) * 1_000_000n },
    ];
  },
  async getPurchaseOrder() { return null; },
  async createPurchaseOrder(vendor, lineItems, expectedDelivery) {
    return { id: BigInt(99), vendor, lineItems, expectedDelivery, status: PurchaseOrderStatus.draft, createdAt: BigInt(Date.now()) * 1_000_000n };
  },
  async updatePurchaseOrderStatus() { return null; },
  async listInvoices() {
    return [
      { id: BigInt(1), contactId: BigInt(1), lineItems: [{ description: "Enterprise Suite Pro", quantity: BigInt(1), unitPrice: BigInt(49900) }], dueDate: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000) * 1_000_000n, status: InvoiceStatus.sent, invoiceNumber: "INV-2026-001", issuedAt: BigInt(Date.now()) * 1_000_000n },
      { id: BigInt(2), contactId: BigInt(2), lineItems: [{ description: "Analytics Module", quantity: BigInt(2), unitPrice: BigInt(14900) }], dueDate: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000) * 1_000_000n, status: InvoiceStatus.overdue, invoiceNumber: "INV-2026-002", issuedAt: BigInt(Date.now() - 35 * 24 * 60 * 60 * 1000) * 1_000_000n },
      { id: BigInt(3), contactId: BigInt(3), lineItems: [{ description: "Support Package Gold", quantity: BigInt(1), unitPrice: BigInt(19900) }], dueDate: BigInt(Date.now() - 15 * 24 * 60 * 60 * 1000) * 1_000_000n, status: InvoiceStatus.paid, invoiceNumber: "INV-2026-003", issuedAt: BigInt(Date.now() - 45 * 24 * 60 * 60 * 1000) * 1_000_000n, paidAt: BigInt(Date.now() - 10 * 24 * 60 * 60 * 1000) * 1_000_000n },
    ];
  },
  async getInvoice() { return null; },
  async createInvoice(contactId, _dealId, lineItems, dueDate) {
    return { id: BigInt(99), contactId, lineItems, dueDate, status: InvoiceStatus.draft, invoiceNumber: "INV-2026-099", issuedAt: BigInt(Date.now()) * 1_000_000n };
  },
  async updateInvoiceStatus() { return null; },
  async deleteInvoice() { return true; },
  async getFinancialSummary() {
    return {
      totalRevenue: BigInt(248500),
      totalExpenses: BigInt(87200),
      grossMargin: BigInt(161300),
      outstandingReceivables: BigInt(64800),
      cashBalance: BigInt(312000),
      inventoryValue: BigInt(145600),
    };
  },
  async getRevenueByPeriod() {
    return [
      ["Jan", BigInt(38200)],
      ["Feb", BigInt(42100)],
      ["Mar", BigInt(51600)],
      ["Apr", BigInt(44800)],
      ["May", BigInt(58300)],
      ["Jun", BigInt(63500)],
    ];
  },
  async bootstrapFirstAdmin() {},
  async assignRole() {},
  async removeRole() {},
  async getMyRole() { return Role.admin; },
  async listUserRoles() {
    return [
      { userId: mockPrincipal, role: Role.admin },
    ];
  },
};
