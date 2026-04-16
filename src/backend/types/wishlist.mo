import Common "common";

module {
  public type UserId = Common.UserId;
  public type ProductId = Common.ProductId;

  public type Wishlist = {
    userId : UserId;
    productIds : [ProductId];
  };
};
