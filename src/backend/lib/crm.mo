import Types "../types/crm";
import Common "../types/common";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

module {
  // ── Role helpers ──────────────────────────────────────────────────────────

  /// Returns true if caller has one of the write-capable roles.
  public func canWrite(
    roles : Map.Map<Common.UserId, Common.Role>,
    caller : Common.UserId,
  ) : Bool {
    switch (roles.get(caller)) {
      case (?(#admin)) true;
      case (?(#manager)) true;
      case (?(#sales_rep)) true;
      case (_) false;
    };
  };

  // ── Contacts ──────────────────────────────────────────────────────────────

  public func listContacts(
    contacts : Map.Map<Types.ContactId, Types.Contact>
  ) : [Types.Contact] {
    contacts.values().toArray();
  };

  public func getContact(
    contacts : Map.Map<Types.ContactId, Types.Contact>,
    id : Types.ContactId,
  ) : ?Types.Contact {
    contacts.get(id);
  };

  public func searchContacts(
    contacts : Map.Map<Types.ContactId, Types.Contact>,
    nameFilter : ?Text,
    emailFilter : ?Text,
    companyFilter : ?Text,
    statusFilter : ?Types.ContactStatus,
  ) : [Types.Contact] {
    let matches = contacts.values().filter(func(c : Types.Contact) : Bool {
      let nameOk = switch (nameFilter) {
        case (null) true;
        case (?n) c.name.toLower().contains(#text (n.toLower()));
      };
      let emailOk = switch (emailFilter) {
        case (null) true;
        case (?e) c.email.toLower().contains(#text (e.toLower()));
      };
      let companyOk = switch (companyFilter) {
        case (null) true;
        case (?co) c.company.toLower().contains(#text (co.toLower()));
      };
      let statusOk = switch (statusFilter) {
        case (null) true;
        case (?s) c.status == s;
      };
      nameOk and emailOk and companyOk and statusOk;
    });
    matches.toArray();
  };

  public func createContact(
    contacts : Map.Map<Types.ContactId, Types.Contact>,
    nextId : { var value : Nat },
    name : Text,
    email : Text,
    phone : Text,
    company : Text,
    status : Types.ContactStatus,
    notes : Text,
  ) : Types.Contact {
    let id = nextId.value;
    nextId.value += 1;
    let contact : Types.Contact = {
      id;
      name;
      email;
      phone;
      company;
      status;
      createdAt = Time.now();
      notes;
    };
    contacts.add(id, contact);
    contact;
  };

  public func updateContact(
    contacts : Map.Map<Types.ContactId, Types.Contact>,
    id : Types.ContactId,
    name : Text,
    email : Text,
    phone : Text,
    company : Text,
    status : Types.ContactStatus,
    notes : Text,
  ) : ?Types.Contact {
    switch (contacts.get(id)) {
      case (null) null;
      case (?existing) {
        let updated : Types.Contact = {
          existing with
          name;
          email;
          phone;
          company;
          status;
          notes;
        };
        contacts.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteContact(
    contacts : Map.Map<Types.ContactId, Types.Contact>,
    id : Types.ContactId,
  ) : Bool {
    switch (contacts.get(id)) {
      case (null) false;
      case (?_) {
        contacts.remove(id);
        true;
      };
    };
  };

  // ── Deals ─────────────────────────────────────────────────────────────────

  public func listDeals(
    deals : Map.Map<Types.DealId, Types.Deal>
  ) : [Types.Deal] {
    deals.values().toArray();
  };

  public func getDeal(
    deals : Map.Map<Types.DealId, Types.Deal>,
    id : Types.DealId,
  ) : ?Types.Deal {
    deals.get(id);
  };

  public func filterDeals(
    deals : Map.Map<Types.DealId, Types.Deal>,
    stageFilter : ?Types.DealStage,
    contactIdFilter : ?Types.ContactId,
  ) : [Types.Deal] {
    let matches = deals.values().filter(func(d : Types.Deal) : Bool {
      let stageOk = switch (stageFilter) {
        case (null) true;
        case (?s) d.stage == s;
      };
      let contactOk = switch (contactIdFilter) {
        case (null) true;
        case (?cid) d.contactId == cid;
      };
      stageOk and contactOk;
    });
    matches.toArray();
  };

  public func createDeal(
    deals : Map.Map<Types.DealId, Types.Deal>,
    nextId : { var value : Nat },
    title : Text,
    value : Nat,
    stage : Types.DealStage,
    contactId : Types.ContactId,
    probability : Nat,
    closeDate : Common.Timestamp,
    notes : Text,
  ) : Types.Deal {
    let id = nextId.value;
    nextId.value += 1;
    let deal : Types.Deal = {
      id;
      title;
      value;
      stage;
      contactId;
      probability;
      closeDate;
      createdAt = Time.now();
      notes;
    };
    deals.add(id, deal);
    deal;
  };

  public func updateDeal(
    deals : Map.Map<Types.DealId, Types.Deal>,
    id : Types.DealId,
    title : Text,
    value : Nat,
    stage : Types.DealStage,
    contactId : Types.ContactId,
    probability : Nat,
    closeDate : Common.Timestamp,
    notes : Text,
  ) : ?Types.Deal {
    switch (deals.get(id)) {
      case (null) null;
      case (?existing) {
        let updated : Types.Deal = {
          existing with
          title;
          value;
          stage;
          contactId;
          probability;
          closeDate;
          notes;
        };
        deals.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteDeal(
    deals : Map.Map<Types.DealId, Types.Deal>,
    id : Types.DealId,
  ) : Bool {
    switch (deals.get(id)) {
      case (null) false;
      case (?_) {
        deals.remove(id);
        true;
      };
    };
  };

  // ── Activities ────────────────────────────────────────────────────────────

  public func listActivities(
    activities : Map.Map<Types.ActivityId, Types.Activity>
  ) : [Types.Activity] {
    activities.values().toArray();
  };

  public func getActivity(
    activities : Map.Map<Types.ActivityId, Types.Activity>,
    id : Types.ActivityId,
  ) : ?Types.Activity {
    activities.get(id);
  };

  public func filterActivities(
    activities : Map.Map<Types.ActivityId, Types.Activity>,
    contactIdFilter : ?Types.ContactId,
    dealIdFilter : ?Types.DealId,
  ) : [Types.Activity] {
    let matches = activities.values().filter(func(a : Types.Activity) : Bool {
      let contactOk = switch (contactIdFilter) {
        case (null) true;
        case (?cid) a.contactId == cid;
      };
      let dealOk = switch (dealIdFilter) {
        case (null) true;
        case (?did) {
          switch (a.dealId) {
            case (?adid) adid == did;
            case (null) false;
          };
        };
      };
      contactOk and dealOk;
    });
    matches.toArray();
  };

  public func createActivity(
    activities : Map.Map<Types.ActivityId, Types.Activity>,
    nextId : { var value : Nat },
    activityType : Types.ActivityType,
    description : Text,
    contactId : Types.ContactId,
    dealId : ?Types.DealId,
    dueDate : Common.Timestamp,
    createdBy : Common.UserId,
  ) : Types.Activity {
    let id = nextId.value;
    nextId.value += 1;
    let activity : Types.Activity = {
      id;
      activityType;
      description;
      contactId;
      dealId;
      dueDate;
      completedAt = null;
      createdBy;
      createdAt = Time.now();
    };
    activities.add(id, activity);
    activity;
  };

  public func completeActivity(
    activities : Map.Map<Types.ActivityId, Types.Activity>,
    id : Types.ActivityId,
    completedAt : Common.Timestamp,
  ) : ?Types.Activity {
    switch (activities.get(id)) {
      case (null) null;
      case (?existing) {
        let updated : Types.Activity = { existing with completedAt = ?completedAt };
        activities.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteActivity(
    activities : Map.Map<Types.ActivityId, Types.Activity>,
    id : Types.ActivityId,
  ) : Bool {
    switch (activities.get(id)) {
      case (null) false;
      case (?_) {
        activities.remove(id);
        true;
      };
    };
  };
};
