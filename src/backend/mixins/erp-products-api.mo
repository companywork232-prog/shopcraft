import ErpTypes "../types/erp";
import Common "../types/common";
import ErpLib "../lib/erp";
import Map "mo:core/Map";

mixin (
  products : Map.Map<ErpTypes.ProductId, ErpTypes.Product>,
  nextProductId : { var value : Nat },
  roles : Map.Map<Common.UserId, Common.Role>,
) {
  public shared query func listProducts() : async [ErpTypes.Product] {
    ErpLib.listProducts(products);
  };

  public shared query func getProduct(id : ErpTypes.ProductId) : async ?ErpTypes.Product {
    ErpLib.getProduct(products, id);
  };

  public shared ({ caller }) func createProduct(
    name : Text,
    sku : Text,
    costPrice : Nat,
    sellingPrice : Nat,
    stockQuantity : Nat,
    reorderThreshold : Nat,
    category : Text,
  ) : async ErpTypes.Product {
    ErpLib.requireAnyRole(roles, caller, [#admin, #manager]);
    ErpLib.createProduct(products, nextProductId, name, sku, costPrice, sellingPrice, stockQuantity, reorderThreshold, category);
  };

  public shared ({ caller }) func updateProduct(
    id : ErpTypes.ProductId,
    name : Text,
    sku : Text,
    costPrice : Nat,
    sellingPrice : Nat,
    stockQuantity : Nat,
    reorderThreshold : Nat,
    category : Text,
  ) : async ?ErpTypes.Product {
    ErpLib.requireAnyRole(roles, caller, [#admin, #manager]);
    ErpLib.updateProduct(products, id, name, sku, costPrice, sellingPrice, stockQuantity, reorderThreshold, category);
  };

  public shared ({ caller }) func adjustStock(id : ErpTypes.ProductId, delta : Int) : async ?ErpTypes.Product {
    ErpLib.requireAnyRole(roles, caller, [#admin, #manager]);
    ErpLib.adjustStock(products, id, delta);
  };

  public shared ({ caller }) func deleteProduct(id : ErpTypes.ProductId) : async Bool {
    ErpLib.requireAnyRole(roles, caller, [#admin, #manager]);
    ErpLib.deleteProduct(products, id);
  };

  public shared query func getLowStockProducts() : async [ErpTypes.Product] {
    ErpLib.lowStockProducts(products);
  };

  public shared query func searchProducts(
    nameFilter : ?Text,
    categoryFilter : ?Text,
    lowStockOnly : Bool,
  ) : async [ErpTypes.Product] {
    ErpLib.searchProducts(products, nameFilter, categoryFilter, lowStockOnly);
  };
};
