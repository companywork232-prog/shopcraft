import OrderTypes "../types/orders";
import CartTypes "../types/cart";
import CatalogTypes "../types/catalog";
import AuthLib "../lib/auth";
import OrdersLib "../lib/orders";
import CartLib "../lib/cart";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  orders : Map.Map<OrderTypes.OrderId, OrderTypes.Order>,
  userOrders : Map.Map<OrderTypes.UserId, List.List<OrderTypes.OrderId>>,
  nextOrderId : { var value : Nat },
  carts : Map.Map<CartTypes.UserId, [CartTypes.CartItem]>,
  products : Map.Map<CatalogTypes.ProductId, CatalogTypes.Product>,
  admins : AuthLib.AdminSet,
) {
  // Create an order from the caller's current cart
  public shared ({ caller }) func createOrder(args : OrderTypes.CreateOrderArgs) : async OrderTypes.Order {
    let cart = CartLib.getCart(carts, caller);
    let id = nextOrderId.value;
    nextOrderId.value += 1;
    let order = OrdersLib.createOrder(orders, userOrders, id, caller, cart.items, products, args);
    // Clear cart after successful order
    CartLib.clearCart(carts, caller);
    order;
  };

  // Get a specific order by ID (caller must own the order or be admin)
  public shared ({ caller }) func getOrder(id : OrderTypes.OrderId) : async ?OrderTypes.Order {
    switch (OrdersLib.getOrder(orders, id)) {
      case null null;
      case (?order) {
        if (Principal.equal(order.userId, caller) or AuthLib.isAdmin(admins, caller)) {
          ?order
        } else {
          Runtime.trap("Unauthorized: not your order");
        };
      };
    };
  };

  // Get the caller's order history
  public shared query ({ caller }) func getMyOrders() : async [OrderTypes.Order] {
    OrdersLib.getUserOrders(orders, userOrders, caller);
  };

  // Admin: list all orders with pagination
  public shared ({ caller }) func adminListOrders(page : Nat, pageSize : Nat) : async [OrderTypes.Order] {
    if (not AuthLib.isAdmin(admins, caller)) {
      Runtime.trap("Unauthorized: caller is not an admin");
    };
    OrdersLib.listAllOrders(orders, page, pageSize);
  };

  // Admin: update the status of an order
  public shared ({ caller }) func adminUpdateOrderStatus(id : OrderTypes.OrderId, status : OrderTypes.OrderStatus) : async ?OrderTypes.Order {
    if (not AuthLib.isAdmin(admins, caller)) {
      Runtime.trap("Unauthorized: caller is not an admin");
    };
    OrdersLib.updateStatus(orders, id, status);
  };
};
