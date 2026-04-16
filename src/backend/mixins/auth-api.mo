import AuthTypes "../types/auth";
import AuthLib "../lib/auth";
import Set "mo:core/Set";

mixin (
  admins : Set.Set<AuthTypes.UserId>,
) {
  // Check if a given principal is an admin
  public query func isAdmin(who : AuthTypes.UserId) : async Bool {
    AuthLib.isAdmin(admins, who);
  };

  // Initialize the first admin on first call (no-op if admins already exist)
  public shared ({ caller }) func initializeAdmin() : async () {
    AuthLib.initializeAdmin(admins, caller);
  };

  // Admin: add a new admin principal
  public shared ({ caller }) func addAdmin(newAdmin : AuthTypes.UserId) : async () {
    AuthLib.addAdmin(admins, caller, newAdmin);
  };

  // Admin: remove an admin principal
  public shared ({ caller }) func removeAdmin(target : AuthTypes.UserId) : async () {
    AuthLib.removeAdmin(admins, caller, target);
  };
};
