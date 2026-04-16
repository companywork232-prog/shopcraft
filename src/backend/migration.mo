import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";

import CommonTypes "types/common";
import CrmTypes "types/crm";
import ErpTypes "types/erp";

module {
  // ── Old ShopCraft types (inline — do NOT import from .old/) ──────────────────
  type OldUserId = Principal;
  type OldProductId = Nat;
  type OldOrderId = Nat;
  type OldTimestamp = Int;

  type OldProduct = {
    id : OldProductId;
    title : Text;
    description : Text;
    price : Nat;
    images : [Text];
    category : Text;
    inventoryCount : Nat;
    soldCount : Nat;
    createdAt : OldTimestamp;
  };

  type OldCartItem = {
    productId : OldProductId;
    quantity : Nat;
  };

  type OldOrderStatus = {
    #pending;
    #paid;
    #shipped;
    #delivered;
    #cancelled;
  };

  type OldShippingAddress = {
    name : Text;
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  type OldOrderItem = {
    productId : OldProductId;
    title : Text;
    price : Nat;
    quantity : Nat;
  };

  type OldOrder = {
    id : OldOrderId;
    userId : OldUserId;
    items : [OldOrderItem];
    shippingAddress : OldShippingAddress;
    paymentIntent : Text;
    status : OldOrderStatus;
    total : Nat;
    createdAt : OldTimestamp;
  };

  // ── Old actor stable state ────────────────────────────────────────────────────
  type OldActor = {
    admins : Set.Set<OldUserId>;
    products : Map.Map<OldProductId, OldProduct>;
    nextProductIdBox : { var value : Nat };
    carts : Map.Map<OldUserId, [OldCartItem]>;
    orders : Map.Map<OldOrderId, OldOrder>;
    userOrders : Map.Map<OldUserId, List.List<OldOrderId>>;
    nextOrderIdBox : { var value : Nat };
    wishlists : Map.Map<OldUserId, [OldProductId]>;
    seeded : Bool;
  };

  // ── New ERP+CRM actor stable state ───────────────────────────────────────────
  type NewActor = {
    roles : Map.Map<CommonTypes.UserId, CommonTypes.Role>;
    bootstrapAdmin : { var value : ?CommonTypes.UserId };
    contacts : Map.Map<CrmTypes.ContactId, CrmTypes.Contact>;
    nextContactId : { var value : Nat };
    deals : Map.Map<CrmTypes.DealId, CrmTypes.Deal>;
    nextDealId : { var value : Nat };
    activities : Map.Map<CrmTypes.ActivityId, CrmTypes.Activity>;
    nextActivityId : { var value : Nat };
    products : Map.Map<ErpTypes.ProductId, ErpTypes.Product>;
    nextProductId : { var value : Nat };
    purchaseOrders : Map.Map<ErpTypes.PurchaseOrderId, ErpTypes.PurchaseOrder>;
    nextPurchaseOrderId : { var value : Nat };
    invoices : Map.Map<ErpTypes.InvoiceId, ErpTypes.Invoice>;
    nextInvoiceId : { var value : Nat };
  };

  // ── Migration: drop all old ShopCraft data, start fresh ERP+CRM ──────────────
  public func run(_old : OldActor) : NewActor {
    {
      roles = Map.empty<CommonTypes.UserId, CommonTypes.Role>();
      bootstrapAdmin = { var value = null };
      contacts = Map.empty<CrmTypes.ContactId, CrmTypes.Contact>();
      nextContactId = { var value = 1 };
      deals = Map.empty<CrmTypes.DealId, CrmTypes.Deal>();
      nextDealId = { var value = 1 };
      activities = Map.empty<CrmTypes.ActivityId, CrmTypes.Activity>();
      nextActivityId = { var value = 1 };
      products = Map.empty<ErpTypes.ProductId, ErpTypes.Product>();
      nextProductId = { var value = 1 };
      purchaseOrders = Map.empty<ErpTypes.PurchaseOrderId, ErpTypes.PurchaseOrder>();
      nextPurchaseOrderId = { var value = 1 };
      invoices = Map.empty<ErpTypes.InvoiceId, ErpTypes.Invoice>();
      nextInvoiceId = { var value = 1 };
    };
  };
};
