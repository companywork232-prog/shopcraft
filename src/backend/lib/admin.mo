import Common "../types/common";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

module {
  public type UserRole = {
    userId : Common.UserId;
    role : Common.Role;
  };

  /// Traps if caller does not have any of the required roles.
  public func requireAnyRole(
    roles : Map.Map<Common.UserId, Common.Role>,
    caller : Common.UserId,
    allowed : [Common.Role],
  ) {
    let callerRole = roles.get(caller);
    let ok = switch (callerRole) {
      case null false;
      case (?r) {
        var found = false;
        for (a in allowed.vals()) {
          if (a == r) { found := true };
        };
        found;
      };
    };
    if (not ok) {
      Runtime.trap("Unauthorized: insufficient role");
    };
  };

  public func assignRole(
    roles : Map.Map<Common.UserId, Common.Role>,
    userId : Common.UserId,
    role : Common.Role,
  ) {
    roles.add(userId, role);
  };

  public func removeRole(
    roles : Map.Map<Common.UserId, Common.Role>,
    userId : Common.UserId,
  ) {
    roles.remove(userId);
  };

  public func getRole(
    roles : Map.Map<Common.UserId, Common.Role>,
    userId : Common.UserId,
  ) : ?Common.Role {
    roles.get(userId);
  };

  public func hasRole(
    roles : Map.Map<Common.UserId, Common.Role>,
    userId : Common.UserId,
    role : Common.Role,
  ) : Bool {
    switch (roles.get(userId)) {
      case (?r) r == role;
      case null false;
    };
  };

  public func listUserRoles(
    roles : Map.Map<Common.UserId, Common.Role>
  ) : [UserRole] {
    let acc = List.empty<UserRole>();
    for ((userId, role) in roles.entries()) {
      acc.add({ userId; role });
    };
    acc.toArray();
  };

  public func requireRole(
    roles : Map.Map<Common.UserId, Common.Role>,
    caller : Common.UserId,
    role : Common.Role,
  ) {
    if (not hasRole(roles, caller, role)) {
      Runtime.trap("Unauthorized: insufficient role");
    };
  };
};
