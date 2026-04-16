import CrmTypes "../types/crm";
import Common "../types/common";
import CrmLib "../lib/crm";
import Map "mo:core/Map";

mixin (
  contacts : Map.Map<CrmTypes.ContactId, CrmTypes.Contact>,
  nextContactId : { var value : Nat },
  roles : Map.Map<Common.UserId, Common.Role>,
) {
  public shared query func listContacts() : async [CrmTypes.Contact] {
    CrmLib.listContacts(contacts);
  };

  public shared query func searchContacts(
    nameFilter : ?Text,
    emailFilter : ?Text,
    companyFilter : ?Text,
    statusFilter : ?CrmTypes.ContactStatus,
  ) : async [CrmTypes.Contact] {
    CrmLib.searchContacts(contacts, nameFilter, emailFilter, companyFilter, statusFilter);
  };

  public shared query func getContact(id : CrmTypes.ContactId) : async ?CrmTypes.Contact {
    CrmLib.getContact(contacts, id);
  };

  public shared ({ caller }) func createContact(
    name : Text,
    email : Text,
    phone : Text,
    company : Text,
    status : CrmTypes.ContactStatus,
    notes : Text,
  ) : async { #ok : CrmTypes.Contact; #err : Text } {
    if (not CrmLib.canWrite(roles, caller)) {
      return #err("Unauthorized: insufficient role");
    };
    #ok(CrmLib.createContact(contacts, nextContactId, name, email, phone, company, status, notes));
  };

  public shared ({ caller }) func updateContact(
    id : CrmTypes.ContactId,
    name : Text,
    email : Text,
    phone : Text,
    company : Text,
    status : CrmTypes.ContactStatus,
    notes : Text,
  ) : async { #ok : ?CrmTypes.Contact; #err : Text } {
    if (not CrmLib.canWrite(roles, caller)) {
      return #err("Unauthorized: insufficient role");
    };
    #ok(CrmLib.updateContact(contacts, id, name, email, phone, company, status, notes));
  };

  public shared ({ caller }) func deleteContact(id : CrmTypes.ContactId) : async { #ok : Bool; #err : Text } {
    if (not CrmLib.canWrite(roles, caller)) {
      return #err("Unauthorized: insufficient role");
    };
    #ok(CrmLib.deleteContact(contacts, id));
  };
};
