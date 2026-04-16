import Types "../types/wishlist";
import Map "mo:core/Map";
import Array "mo:core/Array";

module {
  public type WishlistMap = Map.Map<Types.UserId, [Types.ProductId]>;

  public func getWishlist(
    wishlists : WishlistMap,
    userId : Types.UserId,
  ) : Types.Wishlist {
    let productIds = switch (wishlists.get(userId)) {
      case (?ids) ids;
      case null [];
    };
    { userId; productIds };
  };

  public func addToWishlist(
    wishlists : WishlistMap,
    userId : Types.UserId,
    productId : Types.ProductId,
  ) {
    let existing = switch (wishlists.get(userId)) {
      case (?ids) ids;
      case null [];
    };
    // Only add if not already present
    let alreadyIn = existing.find(func(id : Types.ProductId) : Bool { id == productId });
    let updated = switch (alreadyIn) {
      case (?_) existing;
      case null existing.concat([productId]);
    };
    wishlists.add(userId, updated);
  };

  public func removeFromWishlist(
    wishlists : WishlistMap,
    userId : Types.UserId,
    productId : Types.ProductId,
  ) {
    let existing = switch (wishlists.get(userId)) {
      case (?ids) ids;
      case null [];
    };
    let updated = existing.filter(func(id : Types.ProductId) : Bool { id != productId });
    wishlists.add(userId, updated);
  };
};
