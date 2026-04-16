import CrmTypes "../types/crm";
import Common "../types/common";
import CrmLib "../lib/crm";
import Map "mo:core/Map";

mixin (
  deals : Map.Map<CrmTypes.DealId, CrmTypes.Deal>,
  nextDealId : { var value : Nat },
  roles : Map.Map<Common.UserId, Common.Role>,
) {
  public shared query func listDeals() : async [CrmTypes.Deal] {
    CrmLib.listDeals(deals);
  };

  public shared query func filterDeals(
    stageFilter : ?CrmTypes.DealStage,
    contactIdFilter : ?CrmTypes.ContactId,
  ) : async [CrmTypes.Deal] {
    CrmLib.filterDeals(deals, stageFilter, contactIdFilter);
  };

  public shared query func getDeal(id : CrmTypes.DealId) : async ?CrmTypes.Deal {
    CrmLib.getDeal(deals, id);
  };

  public shared ({ caller }) func createDeal(
    title : Text,
    value : Nat,
    stage : CrmTypes.DealStage,
    contactId : CrmTypes.ContactId,
    probability : Nat,
    closeDate : Common.Timestamp,
    notes : Text,
  ) : async { #ok : CrmTypes.Deal; #err : Text } {
    if (not CrmLib.canWrite(roles, caller)) {
      return #err("Unauthorized: insufficient role");
    };
    #ok(CrmLib.createDeal(deals, nextDealId, title, value, stage, contactId, probability, closeDate, notes));
  };

  public shared ({ caller }) func updateDeal(
    id : CrmTypes.DealId,
    title : Text,
    value : Nat,
    stage : CrmTypes.DealStage,
    contactId : CrmTypes.ContactId,
    probability : Nat,
    closeDate : Common.Timestamp,
    notes : Text,
  ) : async { #ok : ?CrmTypes.Deal; #err : Text } {
    if (not CrmLib.canWrite(roles, caller)) {
      return #err("Unauthorized: insufficient role");
    };
    #ok(CrmLib.updateDeal(deals, id, title, value, stage, contactId, probability, closeDate, notes));
  };

  public shared ({ caller }) func deleteDeal(id : CrmTypes.DealId) : async { #ok : Bool; #err : Text } {
    if (not CrmLib.canWrite(roles, caller)) {
      return #err("Unauthorized: insufficient role");
    };
    #ok(CrmLib.deleteDeal(deals, id));
  };
};
