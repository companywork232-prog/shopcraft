import ErpTypes "../types/erp";
import Common "../types/common";
import ErpLib "../lib/erp";
import Map "mo:core/Map";

mixin (
  purchaseOrders : Map.Map<ErpTypes.PurchaseOrderId, ErpTypes.PurchaseOrder>,
  nextPurchaseOrderId : { var value : Nat },
  products : Map.Map<ErpTypes.ProductId, ErpTypes.Product>,
  roles : Map.Map<Common.UserId, Common.Role>,
) {
  public shared query func listPurchaseOrders() : async [ErpTypes.PurchaseOrder] {
    ErpLib.listPurchaseOrders(purchaseOrders);
  };

  public shared query func getPurchaseOrder(id : ErpTypes.PurchaseOrderId) : async ?ErpTypes.PurchaseOrder {
    ErpLib.getPurchaseOrder(purchaseOrders, id);
  };

  public shared ({ caller }) func createPurchaseOrder(
    vendor : Text,
    lineItems : [ErpTypes.PurchaseLineItem],
    expectedDelivery : Common.Timestamp,
  ) : async ErpTypes.PurchaseOrder {
    ErpLib.requireAnyRole(roles, caller, [#admin, #finance]);
    ErpLib.createPurchaseOrder(purchaseOrders, nextPurchaseOrderId, vendor, lineItems, expectedDelivery);
  };

  public shared ({ caller }) func updatePurchaseOrderStatus(
    id : ErpTypes.PurchaseOrderId,
    status : ErpTypes.PurchaseOrderStatus,
  ) : async ?ErpTypes.PurchaseOrder {
    ErpLib.requireAnyRole(roles, caller, [#admin, #finance]);
    ErpLib.updatePurchaseOrderStatus(purchaseOrders, products, id, status);
  };
};
