import Common "common";

module {
  public type UserId = Common.UserId;
  public type ProductId = Common.ProductId;

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
  };

  public type Cart = {
    userId : UserId;
    items : [CartItem];
  };
};
