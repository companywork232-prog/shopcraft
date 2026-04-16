import CrmTypes "../types/crm";
import Common "../types/common";
import CrmLib "../lib/crm";
import Map "mo:core/Map";

mixin (
  activities : Map.Map<CrmTypes.ActivityId, CrmTypes.Activity>,
  nextActivityId : { var value : Nat },
  roles : Map.Map<Common.UserId, Common.Role>,
) {
  public shared query func listActivities() : async [CrmTypes.Activity] {
    CrmLib.listActivities(activities);
  };

  public shared query func filterActivities(
    contactIdFilter : ?CrmTypes.ContactId,
    dealIdFilter : ?CrmTypes.DealId,
  ) : async [CrmTypes.Activity] {
    CrmLib.filterActivities(activities, contactIdFilter, dealIdFilter);
  };

  public shared query func getActivity(id : CrmTypes.ActivityId) : async ?CrmTypes.Activity {
    CrmLib.getActivity(activities, id);
  };

  public shared ({ caller }) func createActivity(
    activityType : CrmTypes.ActivityType,
    description : Text,
    contactId : CrmTypes.ContactId,
    dealId : ?CrmTypes.DealId,
    dueDate : Common.Timestamp,
  ) : async { #ok : CrmTypes.Activity; #err : Text } {
    if (not CrmLib.canWrite(roles, caller)) {
      return #err("Unauthorized: insufficient role");
    };
    #ok(CrmLib.createActivity(activities, nextActivityId, activityType, description, contactId, dealId, dueDate, caller));
  };

  public shared ({ caller }) func completeActivity(
    id : CrmTypes.ActivityId,
    completedAt : Common.Timestamp,
  ) : async { #ok : ?CrmTypes.Activity; #err : Text } {
    if (not CrmLib.canWrite(roles, caller)) {
      return #err("Unauthorized: insufficient role");
    };
    #ok(CrmLib.completeActivity(activities, id, completedAt));
  };

  public shared ({ caller }) func deleteActivity(id : CrmTypes.ActivityId) : async { #ok : Bool; #err : Text } {
    if (not CrmLib.canWrite(roles, caller)) {
      return #err("Unauthorized: insufficient role");
    };
    #ok(CrmLib.deleteActivity(activities, id));
  };
};
