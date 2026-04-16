import Types "../types/catalog";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

module {
  public type ProductMap = Map.Map<Types.ProductId, Types.Product>;

  public func listProducts(
    products : ProductMap,
    args : Types.ListProductsArgs,
  ) : Types.PageResult {
    // Collect all products into a list for filtering/sorting
    var all = List.empty<Types.Product>();
    for ((_, p) in products.entries()) {
      all.add(p);
    };

    // Filter by category
    switch (args.category) {
      case (?cat) {
        all := all.filter(func(p) { p.category == cat });
      };
      case null {};
    };

    // Filter by min price
    switch (args.minPrice) {
      case (?minP) {
        all := all.filter(func(p) { p.price >= minP });
      };
      case null {};
    };

    // Filter by max price
    switch (args.maxPrice) {
      case (?maxP) {
        all := all.filter(func(p) { p.price <= maxP });
      };
      case null {};
    };

    // Filter by search term
    switch (args.search) {
      case (?term) {
        let lower = term.toLower();
        all := all.filter(func(p) {
          p.title.toLower().contains(#text lower) or
          p.description.toLower().contains(#text lower)
        });
      };
      case null {};
    };

    // Sort
    let sorted = switch (args.sortBy) {
      case (#priceAsc) {
        all.sort(func(a, b) {
          if (a.price < b.price) #less
          else if (a.price > b.price) #greater
          else #equal
        });
      };
      case (#priceDesc) {
        all.sort(func(a, b) {
          if (a.price > b.price) #less
          else if (a.price < b.price) #greater
          else #equal
        });
      };
      case (#newest) {
        all.sort(func(a, b) {
          if (a.createdAt > b.createdAt) #less
          else if (a.createdAt < b.createdAt) #greater
          else #equal
        });
      };
      case (#bestSelling) {
        all.sort(func(a, b) {
          if (a.soldCount > b.soldCount) #less
          else if (a.soldCount < b.soldCount) #greater
          else #equal
        });
      };
    };

    let total = sorted.size();
    let start = args.page * args.pageSize;
    let items = if (start >= total) {
      []
    } else {
      let endIdx = Nat.min(start + args.pageSize, total);
      sorted.sliceToArray(start, endIdx)
    };

    { items; total; page = args.page; pageSize = args.pageSize };
  };

  public func getProduct(
    products : ProductMap,
    id : Types.ProductId,
  ) : ?Types.Product {
    products.get(id);
  };

  public func createProduct(
    products : ProductMap,
    nextId : Nat,
    input : Types.ProductInput,
  ) : Types.Product {
    let product : Types.Product = {
      id = nextId;
      title = input.title;
      description = input.description;
      price = input.price;
      images = input.images;
      category = input.category;
      inventoryCount = input.inventoryCount;
      soldCount = 0;
      createdAt = Time.now();
    };
    products.add(nextId, product);
    product;
  };

  public func updateProduct(
    products : ProductMap,
    id : Types.ProductId,
    input : Types.ProductInput,
  ) : ?Types.Product {
    switch (products.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Product = {
          existing with
          title = input.title;
          description = input.description;
          price = input.price;
          images = input.images;
          category = input.category;
          inventoryCount = input.inventoryCount;
        };
        products.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteProduct(
    products : ProductMap,
    id : Types.ProductId,
  ) : Bool {
    switch (products.get(id)) {
      case null false;
      case (?_) {
        products.remove(id);
        true;
      };
    };
  };

  public func searchProducts(
    products : ProductMap,
    term : Text,
    page : Nat,
    pageSize : Nat,
  ) : Types.PageResult {
    listProducts(
      products,
      {
        page;
        pageSize;
        category = null;
        minPrice = null;
        maxPrice = null;
        sortBy = #newest;
        search = ?term;
      },
    );
  };
};
