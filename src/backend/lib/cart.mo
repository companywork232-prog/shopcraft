import Types "../types/cart";
import Map "mo:core/Map";
import Array "mo:core/Array";

module {
  public type CartMap = Map.Map<Types.UserId, [Types.CartItem]>;

  public func getCart(
    carts : CartMap,
    userId : Types.UserId,
  ) : Types.Cart {
    let items = switch (carts.get(userId)) {
      case (?i) i;
      case null [];
    };
    { userId; items };
  };

  public func addItem(
    carts : CartMap,
    userId : Types.UserId,
    productId : Types.ProductId,
    quantity : Nat,
  ) {
    let existing = switch (carts.get(userId)) {
      case (?i) i;
      case null [];
    };
    // Check if product already in cart
    let found = existing.find(func(item : Types.CartItem) : Bool { item.productId == productId });
    let updated = switch (found) {
      case (?_item) {
        existing.map(func(i : Types.CartItem) : Types.CartItem {
          if (i.productId == productId) {
            { i with quantity = i.quantity + quantity }
          } else i
        })
      };
      case null {
        let newItem : Types.CartItem = { productId; quantity };
        existing.concat([newItem])
      };
    };
    carts.add(userId, updated);
  };

  public func removeItem(
    carts : CartMap,
    userId : Types.UserId,
    productId : Types.ProductId,
  ) {
    let existing = switch (carts.get(userId)) {
      case (?i) i;
      case null [];
    };
    let updated = existing.filter(func(item : Types.CartItem) : Bool { item.productId != productId });
    carts.add(userId, updated);
  };

  public func updateQuantity(
    carts : CartMap,
    userId : Types.UserId,
    productId : Types.ProductId,
    quantity : Nat,
  ) {
    let existing = switch (carts.get(userId)) {
      case (?i) i;
      case null [];
    };
    let updated = if (quantity == 0) {
      existing.filter(func(item : Types.CartItem) : Bool { item.productId != productId })
    } else {
      existing.map(func(i : Types.CartItem) : Types.CartItem {
        if (i.productId == productId) { { i with quantity } } else i
      })
    };
    carts.add(userId, updated);
  };

  public func clearCart(
    carts : CartMap,
    userId : Types.UserId,
  ) {
    carts.add(userId, []);
  };
};
