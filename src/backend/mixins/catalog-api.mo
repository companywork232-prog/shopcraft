import CatalogTypes "../types/catalog";
import AuthLib "../lib/auth";
import CatalogLib "../lib/catalog";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

mixin (
  products : Map.Map<CatalogTypes.ProductId, CatalogTypes.Product>,
  nextProductId : { var value : Nat },
  admins : AuthLib.AdminSet,
) {
  // Public: list products with filters, pagination, and sorting
  public query func listProducts(args : CatalogTypes.ListProductsArgs) : async CatalogTypes.PageResult {
    CatalogLib.listProducts(products, args);
  };

  // Public: get a single product by ID
  public query func getProduct(id : CatalogTypes.ProductId) : async ?CatalogTypes.Product {
    CatalogLib.getProduct(products, id);
  };

  // Public: search products by name/description
  public query func searchProducts(term : Text, page : Nat, pageSize : Nat) : async CatalogTypes.PageResult {
    CatalogLib.searchProducts(products, term, page, pageSize);
  };

  // Admin: create a new product
  public shared ({ caller }) func createProduct(input : CatalogTypes.ProductInput) : async CatalogTypes.Product {
    if (not AuthLib.isAdmin(admins, caller)) {
      Runtime.trap("Unauthorized: caller is not an admin");
    };
    let id = nextProductId.value;
    nextProductId.value += 1;
    CatalogLib.createProduct(products, id, input);
  };

  // Admin: update an existing product
  public shared ({ caller }) func updateProduct(id : CatalogTypes.ProductId, input : CatalogTypes.ProductInput) : async ?CatalogTypes.Product {
    if (not AuthLib.isAdmin(admins, caller)) {
      Runtime.trap("Unauthorized: caller is not an admin");
    };
    CatalogLib.updateProduct(products, id, input);
  };

  // Admin: delete a product
  public shared ({ caller }) func deleteProduct(id : CatalogTypes.ProductId) : async Bool {
    if (not AuthLib.isAdmin(admins, caller)) {
      Runtime.trap("Unauthorized: caller is not an admin");
    };
    CatalogLib.deleteProduct(products, id);
  };
};
