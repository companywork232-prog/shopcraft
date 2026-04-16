import Types "../types/erp";
import Common "../types/common";
import AdminLib "../lib/admin";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

module {
  // ── Role helpers ──────────────────────────────────────────────────────────

  /// Traps if caller does not have any of the required roles.
  /// Delegates to AdminLib.requireAnyRole for shared implementation.
  public func requireAnyRole(
    roles : Map.Map<Common.UserId, Common.Role>,
    caller : Common.UserId,
    allowed : [Common.Role],
  ) {
    AdminLib.requireAnyRole(roles, caller, allowed);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  func invoiceTotal(inv : Types.Invoice) : Nat {
    var total = 0;
    for (item in inv.lineItems.vals()) {
      total += item.quantity * item.unitPrice;
    };
    total;
  };

  // ── Products ──────────────────────────────────────────────────────────────

  public func listProducts(
    products : Map.Map<Types.ProductId, Types.Product>
  ) : [Types.Product] {
    let acc = List.empty<Types.Product>();
    for ((_, p) in products.entries()) {
      acc.add(p);
    };
    acc.toArray();
  };

  public func getProduct(
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.ProductId,
  ) : ?Types.Product {
    products.get(id);
  };

  public func createProduct(
    products : Map.Map<Types.ProductId, Types.Product>,
    nextId : { var value : Nat },
    name : Text,
    sku : Text,
    costPrice : Nat,
    sellingPrice : Nat,
    stockQuantity : Nat,
    reorderThreshold : Nat,
    category : Text,
  ) : Types.Product {
    let id = nextId.value;
    nextId.value += 1;
    let product : Types.Product = {
      id;
      name;
      sku;
      costPrice;
      sellingPrice;
      stockQuantity;
      reorderThreshold;
      category;
      createdAt = Time.now();
    };
    products.add(id, product);
    product;
  };

  public func updateProduct(
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.ProductId,
    name : Text,
    sku : Text,
    costPrice : Nat,
    sellingPrice : Nat,
    stockQuantity : Nat,
    reorderThreshold : Nat,
    category : Text,
  ) : ?Types.Product {
    switch (products.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Product = {
          existing with
          name;
          sku;
          costPrice;
          sellingPrice;
          stockQuantity;
          reorderThreshold;
          category;
        };
        products.add(id, updated);
        ?updated;
      };
    };
  };

  public func adjustStock(
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.ProductId,
    delta : Int,
  ) : ?Types.Product {
    switch (products.get(id)) {
      case null null;
      case (?existing) {
        let newQty : Int = existing.stockQuantity.toInt() + delta;
        if (newQty < 0) {
          return null; // not enough stock
        };
        let updated : Types.Product = {
          existing with
          stockQuantity = newQty.toNat();
        };
        products.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteProduct(
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.ProductId,
  ) : Bool {
    switch (products.get(id)) {
      case null false;
      case _ {
        products.remove(id);
        true;
      };
    };
  };

  public func lowStockProducts(
    products : Map.Map<Types.ProductId, Types.Product>
  ) : [Types.Product] {
    let acc = List.empty<Types.Product>();
    for ((_, p) in products.entries()) {
      if (p.stockQuantity <= p.reorderThreshold) {
        acc.add(p);
      };
    };
    acc.toArray();
  };

  public func searchProducts(
    products : Map.Map<Types.ProductId, Types.Product>,
    nameFilter : ?Text,
    categoryFilter : ?Text,
    lowStockOnly : Bool,
  ) : [Types.Product] {
    let acc = List.empty<Types.Product>();
    for ((_, p) in products.entries()) {
      let nameMatch = switch (nameFilter) {
        case null true;
        case (?n) p.name.toLower().contains(#text (n.toLower()));
      };
      let catMatch = switch (categoryFilter) {
        case null true;
        case (?c) p.category.toLower() == c.toLower();
      };
      let stockMatch = if (lowStockOnly) p.stockQuantity <= p.reorderThreshold else true;
      if (nameMatch and catMatch and stockMatch) {
        acc.add(p);
      };
    };
    acc.toArray();
  };

  // ── Purchase Orders ───────────────────────────────────────────────────────

  public func listPurchaseOrders(
    orders : Map.Map<Types.PurchaseOrderId, Types.PurchaseOrder>
  ) : [Types.PurchaseOrder] {
    let acc = List.empty<Types.PurchaseOrder>();
    for ((_, o) in orders.entries()) {
      acc.add(o);
    };
    acc.toArray();
  };

  public func getPurchaseOrder(
    orders : Map.Map<Types.PurchaseOrderId, Types.PurchaseOrder>,
    id : Types.PurchaseOrderId,
  ) : ?Types.PurchaseOrder {
    orders.get(id);
  };

  public func createPurchaseOrder(
    orders : Map.Map<Types.PurchaseOrderId, Types.PurchaseOrder>,
    nextId : { var value : Nat },
    vendor : Text,
    lineItems : [Types.PurchaseLineItem],
    expectedDelivery : Common.Timestamp,
  ) : Types.PurchaseOrder {
    let id = nextId.value;
    nextId.value += 1;
    let order : Types.PurchaseOrder = {
      id;
      vendor;
      status = #draft;
      lineItems;
      expectedDelivery;
      createdAt = Time.now();
    };
    orders.add(id, order);
    order;
  };

  public func updatePurchaseOrderStatus(
    orders : Map.Map<Types.PurchaseOrderId, Types.PurchaseOrder>,
    products : Map.Map<Types.ProductId, Types.Product>,
    id : Types.PurchaseOrderId,
    status : Types.PurchaseOrderStatus,
  ) : ?Types.PurchaseOrder {
    switch (orders.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.PurchaseOrder = { existing with status };
        orders.add(id, updated);
        // Auto-increment stock when marked received
        switch (status) {
          case (#received) {
            for (item in existing.lineItems.vals()) {
              switch (products.get(item.productId)) {
                case null {};
                case (?p) {
                  let restocked : Types.Product = {
                    p with
                    stockQuantity = p.stockQuantity + item.quantity;
                  };
                  products.add(item.productId, restocked);
                };
              };
            };
          };
          case _ {};
        };
        ?updated;
      };
    };
  };

  // ── Invoices ──────────────────────────────────────────────────────────────

  public func listInvoices(
    invoices : Map.Map<Types.InvoiceId, Types.Invoice>
  ) : [Types.Invoice] {
    let acc = List.empty<Types.Invoice>();
    for ((_, inv) in invoices.entries()) {
      acc.add(inv);
    };
    acc.toArray();
  };

  public func getInvoice(
    invoices : Map.Map<Types.InvoiceId, Types.Invoice>,
    id : Types.InvoiceId,
  ) : ?Types.Invoice {
    invoices.get(id);
  };

  public func createInvoice(
    invoices : Map.Map<Types.InvoiceId, Types.Invoice>,
    nextId : { var value : Nat },
    contactId : Common.EntityId,
    dealId : ?Common.EntityId,
    lineItems : [Types.InvoiceLineItem],
    dueDate : Common.Timestamp,
  ) : Types.Invoice {
    let id = nextId.value;
    nextId.value += 1;
    // Format invoice number as INV-001, INV-002, etc.
    let numStr = id.toText();
    let padded = if (numStr.size() < 3) {
      let zeros = 3 - numStr.size();
      var prefix = "";
      var i = 0;
      while (i < zeros) { prefix #= "0"; i += 1 };
      prefix # numStr;
    } else numStr;
    let invoiceNumber = "INV-" # padded;
    let invoice : Types.Invoice = {
      id;
      invoiceNumber;
      contactId;
      dealId;
      status = #draft;
      lineItems;
      issuedAt = Time.now();
      dueDate;
      paidAt = null;
    };
    invoices.add(id, invoice);
    invoice;
  };

  public func updateInvoiceStatus(
    invoices : Map.Map<Types.InvoiceId, Types.Invoice>,
    id : Types.InvoiceId,
    status : Types.InvoiceStatus,
    paidAt : ?Common.Timestamp,
  ) : ?Types.Invoice {
    switch (invoices.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Invoice = { existing with status; paidAt };
        invoices.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteInvoice(
    invoices : Map.Map<Types.InvoiceId, Types.Invoice>,
    id : Types.InvoiceId,
  ) : Bool {
    switch (invoices.get(id)) {
      case null false;
      case _ {
        invoices.remove(id);
        true;
      };
    };
  };

  // ── Financial summary ─────────────────────────────────────────────────────

  public func totalRevenue(
    invoices : Map.Map<Types.InvoiceId, Types.Invoice>
  ) : Nat {
    var total = 0;
    for ((_, inv) in invoices.entries()) {
      switch (inv.status) {
        case (#paid) { total += invoiceTotal(inv) };
        case _ {};
      };
    };
    total;
  };

  public func totalOutstandingReceivables(
    invoices : Map.Map<Types.InvoiceId, Types.Invoice>
  ) : Nat {
    var total = 0;
    for ((_, inv) in invoices.entries()) {
      switch (inv.status) {
        case (#sent or #overdue) { total += invoiceTotal(inv) };
        case _ {};
      };
    };
    total;
  };

  public func totalInventoryValue(
    products : Map.Map<Types.ProductId, Types.Product>
  ) : Nat {
    var total = 0;
    for ((_, p) in products.entries()) {
      total += p.stockQuantity * p.costPrice;
    };
    total;
  };

  public func totalExpenses(
    purchaseOrders : Map.Map<Types.PurchaseOrderId, Types.PurchaseOrder>
  ) : Nat {
    var total = 0;
    for ((_, po) in purchaseOrders.entries()) {
      switch (po.status) {
        case (#received) {
          for (item in po.lineItems.vals()) {
            total += item.quantity * item.unitCost;
          };
        };
        case _ {};
      };
    };
    total;
  };

  public func revenueByPeriod(
    invoices : Map.Map<Types.InvoiceId, Types.Invoice>,
    months : Nat,
    nowNs : Int,
  ) : [(Text, Nat)] {
    // Each bucket covers one calendar month; we use a simple 30-day bucket approach
    let monthNs : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
    // Use a mutable var array for totals to avoid var fields in generic type parameters
    let totals = Array.tabulate(months, func(_) { 0 });
    let varTotals = totals.toVarArray<Nat>();
    for ((_, inv) in invoices.entries()) {
      switch (inv.status) {
        case (#paid) {
          let age = nowNs - inv.issuedAt;
          if (age >= 0) {
            let bucketIdx = (age / monthNs).toNat();
            if (bucketIdx < months) {
              // index 0 = oldest bucket (M-N), index months-1 = most recent (M-1)
              let slot = months - 1 - bucketIdx;
              varTotals[slot] += invoiceTotal(inv);
            };
          };
        };
        case _ {};
      };
    };
    Array.tabulate<(Text, Nat)>(
      months,
      func(i) { ("M-" # (months - i).toText(), varTotals[i]) }
    );
  };
};
