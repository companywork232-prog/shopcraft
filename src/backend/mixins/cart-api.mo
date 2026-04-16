import CartTypes "../types/cart";
import CartLib "../lib/cart";
import Map "mo:core/Map";

mixin (
  carts : Map.Map<CartTypes.UserId, [CartTypes.CartItem]>,
) {
  // Get the caller's cart
  public shared query ({ caller }) func getCart() : async CartTypes.Cart {
    CartLib.getCart(carts, caller);
  };

  // Add an item (or increment quantity) in the caller's cart
  public shared ({ caller }) func addToCart(productId : CartTypes.ProductId, quantity : Nat) : async () {
    CartLib.addItem(carts, caller, productId, quantity);
  };

  // Remove an item from the caller's cart
  public shared ({ caller }) func removeFromCart(productId : CartTypes.ProductId) : async () {
    CartLib.removeItem(carts, caller, productId);
  };

  // Update quantity of an item in the caller's cart
  public shared ({ caller }) func updateCartQuantity(productId : CartTypes.ProductId, quantity : Nat) : async () {
    CartLib.updateQuantity(carts, caller, productId, quantity);
  };

  // Clear the caller's entire cart
  public shared ({ caller }) func clearCart() : async () {
    CartLib.clearCart(carts, caller);
  };
};
