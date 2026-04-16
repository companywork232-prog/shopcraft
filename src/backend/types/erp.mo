import Common "common";

module {
  public type ProductId = Common.EntityId;
  public type PurchaseOrderId = Common.EntityId;
  public type InvoiceId = Common.EntityId;

  public type Product = {
    id : ProductId;
    name : Text;
    sku : Text;
    costPrice : Nat; // cents
    sellingPrice : Nat; // cents
    stockQuantity : Nat;
    reorderThreshold : Nat;
    category : Text;
    createdAt : Common.Timestamp;
  };

  public type PurchaseOrderStatus = {
    #draft;
    #submitted;
    #received;
    #cancelled;
  };

  public type PurchaseLineItem = {
    productId : ProductId;
    quantity : Nat;
    unitCost : Nat; // cents
  };

  public type PurchaseOrder = {
    id : PurchaseOrderId;
    vendor : Text;
    status : PurchaseOrderStatus;
    lineItems : [PurchaseLineItem];
    expectedDelivery : Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type InvoiceStatus = {
    #draft;
    #sent;
    #paid;
    #overdue;
    #cancelled;
  };

  public type InvoiceLineItem = {
    description : Text;
    quantity : Nat;
    unitPrice : Nat; // cents
  };

  public type Invoice = {
    id : InvoiceId;
    invoiceNumber : Text;
    contactId : Common.EntityId;
    dealId : ?Common.EntityId;
    status : InvoiceStatus;
    lineItems : [InvoiceLineItem];
    issuedAt : Common.Timestamp;
    dueDate : Common.Timestamp;
    paidAt : ?Common.Timestamp;
  };
};
