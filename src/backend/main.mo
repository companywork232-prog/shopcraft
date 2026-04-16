import CrmTypes "types/crm";
import ErpTypes "types/erp";
import Common "types/common";

import CrmContactsApi "mixins/crm-contacts-api";
import CrmDealsApi "mixins/crm-deals-api";
import CrmActivitiesApi "mixins/crm-activities-api";
import ErpProductsApi "mixins/erp-products-api";
import ErpPurchaseOrdersApi "mixins/erp-purchase-orders-api";
import ErpInvoicesApi "mixins/erp-invoices-api";
import ErpFinancialApi "mixins/erp-financial-api";
import AdminApi "mixins/admin-api";
import Migration "migration";

import Map "mo:core/Map";

(with migration = Migration.run)
actor {
  // ── Role management ────────────────────────────────────────────────────────
  let roles = Map.empty<Common.UserId, Common.Role>();
  let bootstrapAdmin = { var value : ?Common.UserId = null };

  // ── CRM state ──────────────────────────────────────────────────────────────
  let contacts = Map.empty<CrmTypes.ContactId, CrmTypes.Contact>();
  let nextContactId = { var value : Nat = 1 };

  let deals = Map.empty<CrmTypes.DealId, CrmTypes.Deal>();
  let nextDealId = { var value : Nat = 1 };

  let activities = Map.empty<CrmTypes.ActivityId, CrmTypes.Activity>();
  let nextActivityId = { var value : Nat = 1 };

  // ── ERP state ──────────────────────────────────────────────────────────────
  let products = Map.empty<ErpTypes.ProductId, ErpTypes.Product>();
  let nextProductId = { var value : Nat = 1 };

  let purchaseOrders = Map.empty<ErpTypes.PurchaseOrderId, ErpTypes.PurchaseOrder>();
  let nextPurchaseOrderId = { var value : Nat = 1 };

  let invoices = Map.empty<ErpTypes.InvoiceId, ErpTypes.Invoice>();
  let nextInvoiceId = { var value : Nat = 1 };

  // ── Mixin includes ─────────────────────────────────────────────────────────
  include AdminApi(roles, bootstrapAdmin);
  include CrmContactsApi(contacts, nextContactId, roles);
  include CrmDealsApi(deals, nextDealId, roles);
  include CrmActivitiesApi(activities, nextActivityId, roles);
  include ErpProductsApi(products, nextProductId, roles);
  include ErpPurchaseOrdersApi(purchaseOrders, nextPurchaseOrderId, products, roles);
  include ErpInvoicesApi(invoices, nextInvoiceId, roles);
  include ErpFinancialApi(invoices, purchaseOrders, products, roles);
};
