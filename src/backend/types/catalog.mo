import Common "common";

module {
  public type ProductId = Common.ProductId;
  public type Timestamp = Common.Timestamp;

  public type Product = {
    id : ProductId;
    title : Text;
    description : Text;
    price : Nat; // in smallest currency unit (e.g. cents)
    images : [Text];
    category : Text;
    inventoryCount : Nat;
    soldCount : Nat;
    createdAt : Timestamp;
  };

  public type ProductInput = {
    title : Text;
    description : Text;
    price : Nat;
    images : [Text];
    category : Text;
    inventoryCount : Nat;
  };

  public type SortOption = {
    #priceAsc;
    #priceDesc;
    #newest;
    #bestSelling;
  };

  public type ListProductsArgs = {
    page : Nat;
    pageSize : Nat;
    category : ?Text;
    minPrice : ?Nat;
    maxPrice : ?Nat;
    sortBy : SortOption;
    search : ?Text;
  };

  public type PageResult = {
    items : [Product];
    total : Nat;
    page : Nat;
    pageSize : Nat;
  };
};
