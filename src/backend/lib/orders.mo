import Types "../types/orders";
import CartTypes "../types/cart";
import CatalogTypes "../types/catalog";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

module {
  public type OrderMap = Map.Map<Types.OrderId, Types.Order>;
  public type UserOrderIndex = Map.Map<Types.UserId, List.List<Types.OrderId>>;

  public func createOrder(
    orders : OrderMap,
    userOrders : UserOrderIndex,
    nextId : Nat,
    userId : Types.UserId,
    cartItems : [CartTypes.CartItem],
    products : Map.Map<CatalogTypes.ProductId, CatalogTypes.Product>,
    args : Types.CreateOrderArgs,
  ) : Types.Order {
    if (cartItems.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    // Validate payment intent
    if (args.paymentIntent.size() == 0) {
      Runtime.trap("Invalid payment intent");
    };

    // Snapshot items and validate inventory
    var total : Nat = 0;
    let orderItems = cartItems.map(func(cartItem : CartTypes.CartItem) : Types.OrderItem {
      let product = switch (products.get(cartItem.productId)) {
        case (?p) p;
        case null Runtime.trap("Product not found: " # cartItem.productId.toText());
      };
      if (product.inventoryCount < cartItem.quantity) {
        Runtime.trap("Insufficient inventory for product: " # product.title);
      };
      total += product.price * cartItem.quantity;
      {
        productId = cartItem.productId;
        title = product.title;
        price = product.price;
        quantity = cartItem.quantity;
      };
    });

    // Decrement inventory and increment soldCount for each product
    for (orderItem in orderItems.values()) {
      switch (products.get(orderItem.productId)) {
        case (?p) {
          let updated : CatalogTypes.Product = {
            p with
            inventoryCount = p.inventoryCount - orderItem.quantity;
            soldCount = p.soldCount + orderItem.quantity;
          };
          products.add(orderItem.productId, updated);
        };
        case null {};
      };
    };

    let order : Types.Order = {
      id = nextId;
      userId;
      items = orderItems;
      shippingAddress = args.shippingAddress;
      paymentIntent = args.paymentIntent;
      status = #paid;
      total;
      createdAt = Time.now();
    };

    orders.add(nextId, order);

    // Update user order index
    let existingIds = switch (userOrders.get(userId)) {
      case (?ids) ids;
      case null List.empty<Types.OrderId>();
    };
    existingIds.add(nextId);
    userOrders.add(userId, existingIds);

    order;
  };

  public func getOrder(
    orders : OrderMap,
    id : Types.OrderId,
  ) : ?Types.Order {
    orders.get(id);
  };

  public func getUserOrders(
    orders : OrderMap,
    userOrders : UserOrderIndex,
    userId : Types.UserId,
  ) : [Types.Order] {
    let ids = switch (userOrders.get(userId)) {
      case (?ids) ids;
      case null return [];
    };
    let result = List.empty<Types.Order>();
    for (id in ids.values()) {
      switch (orders.get(id)) {
        case (?o) result.add(o);
        case null {};
      };
    };
    result.toArray();
  };

  public func listAllOrders(
    orders : OrderMap,
    page : Nat,
    pageSize : Nat,
  ) : [Types.Order] {
    let all = List.empty<Types.Order>();
    for ((_, o) in orders.entries()) {
      all.add(o);
    };
    // Sort by createdAt descending (newest first)
    all.sortInPlace(func(a, b) {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal
    });
    let total = all.size();
    let start = page * pageSize;
    if (start >= total) return [];
    let endIdx = Nat.min(start + pageSize, total);
    all.sliceToArray(start, endIdx);
  };

  public func updateStatus(
    orders : OrderMap,
    id : Types.OrderId,
    status : Types.OrderStatus,
  ) : ?Types.Order {
    switch (orders.get(id)) {
      case null null;
      case (?order) {
        let updated : Types.Order = { order with status };
        orders.add(id, updated);
        ?updated;
      };
    };
  };
};
