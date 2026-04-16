import Common "common";
import Cart "cart";

module {
  public type UserId = Common.UserId;
  public type OrderId = Common.OrderId;
  public type ProductId = Common.ProductId;
  public type Timestamp = Common.Timestamp;

  public type OrderStatus = {
    #pending;
    #paid;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type ShippingAddress = {
    name : Text;
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  public type OrderItem = {
    productId : ProductId;
    title : Text;
    price : Nat;
    quantity : Nat;
  };

  public type Order = {
    id : OrderId;
    userId : UserId;
    items : [OrderItem];
    shippingAddress : ShippingAddress;
    paymentIntent : Text;
    status : OrderStatus;
    total : Nat;
    createdAt : Timestamp;
  };

  public type CreateOrderArgs = {
    shippingAddress : ShippingAddress;
    paymentIntent : Text;
  };
};
