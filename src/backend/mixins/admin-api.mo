import Common "../types/common";
import AdminLib "../lib/admin";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

mixin (
  roles : Map.Map<Common.UserId, Common.Role>,
  bootstrapAdmin : { var value : ?Common.UserId },
) {
  /// Assigns a role to a user. Only admins may call this (or bootstrap first admin).
  public shared ({ caller }) func assignRole(userId : Common.UserId, role : Common.Role) : async () {
    AdminLib.requireRole(roles, caller, #admin);
    AdminLib.assignRole(roles, userId, role);
  };

  /// Removes the role from a user. Only admins may call this.
  public shared ({ caller }) func removeRole(userId : Common.UserId) : async () {
    AdminLib.requireRole(roles, caller, #admin);
    AdminLib.removeRole(roles, userId);
  };

  /// Returns the role of the calling principal, if any.
  public shared query ({ caller }) func getMyRole() : async ?Common.Role {
    AdminLib.getRole(roles, caller);
  };

  /// Lists all users and their assigned roles.
  public shared query ({ caller }) func listUserRoles() : async [AdminLib.UserRole] {
    AdminLib.requireRole(roles, caller, #admin);
    AdminLib.listUserRoles(roles);
  };

  /// Allows the very first caller to self-promote to admin when no admins exist yet.
  public shared ({ caller }) func bootstrapFirstAdmin() : async () {
    switch (bootstrapAdmin.value) {
      case (?_) Runtime.trap("Bootstrap already completed");
      case null {
        // Only allow if no roles are assigned yet
        if (roles.size() > 0) {
          Runtime.trap("Roles already exist — use assignRole instead");
        };
        bootstrapAdmin.value := ?caller;
        AdminLib.assignRole(roles, caller, #admin);
      };
    };
  };
};
