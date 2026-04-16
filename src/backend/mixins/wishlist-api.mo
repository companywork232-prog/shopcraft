import WishlistTypes "../types/wishlist";
import WishlistLib "../lib/wishlist";
import Map "mo:core/Map";

mixin (
  wishlists : Map.Map<WishlistTypes.UserId, [WishlistTypes.ProductId]>,
) {
  // Get the caller's wishlist
  public shared query ({ caller }) func getWishlist() : async WishlistTypes.Wishlist {
    WishlistLib.getWishlist(wishlists, caller);
  };

  // Add a product to the caller's wishlist
  public shared ({ caller }) func addToWishlist(productId : WishlistTypes.ProductId) : async () {
    WishlistLib.addToWishlist(wishlists, caller, productId);
  };

  // Remove a product from the caller's wishlist
  public shared ({ caller }) func removeFromWishlist(productId : WishlistTypes.ProductId) : async () {
    WishlistLib.removeFromWishlist(wishlists, caller, productId);
  };
};
