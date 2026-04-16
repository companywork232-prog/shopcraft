import Types "../types/auth";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";

module {
  public type AdminSet = Set.Set<Types.UserId>;

  public func isAdmin(
    admins : AdminSet,
    caller : Types.UserId,
  ) : Bool {
    admins.contains(caller);
  };

  public func initializeAdmin(
    admins : AdminSet,
    caller : Types.UserId,
  ) {
    if (admins.isEmpty()) {
      admins.add(caller);
    };
  };

  public func addAdmin(
    admins : AdminSet,
    caller : Types.UserId,
    newAdmin : Types.UserId,
  ) {
    if (not admins.contains(caller)) {
      Runtime.trap("Unauthorized: caller is not an admin");
    };
    admins.add(newAdmin);
  };

  public func removeAdmin(
    admins : AdminSet,
    caller : Types.UserId,
    target : Types.UserId,
  ) {
    if (not admins.contains(caller)) {
      Runtime.trap("Unauthorized: caller is not an admin");
    };
    admins.remove(target);
  };
};
