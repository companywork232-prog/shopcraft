import Common "common";

module {
  public type ContactId = Common.EntityId;
  public type DealId = Common.EntityId;
  public type ActivityId = Common.EntityId;

  public type ContactStatus = {
    #lead;
    #prospect;
    #customer;
  };

  public type Contact = {
    id : ContactId;
    name : Text;
    email : Text;
    phone : Text;
    company : Text;
    status : ContactStatus;
    createdAt : Common.Timestamp;
    notes : Text;
  };

  public type DealStage = {
    #prospect;
    #discovery;
    #proposal;
    #negotiation;
    #closed_won;
    #closed_lost;
  };

  public type Deal = {
    id : DealId;
    title : Text;
    value : Nat; // cents
    stage : DealStage;
    contactId : ContactId;
    probability : Nat; // 0–100
    closeDate : Common.Timestamp;
    createdAt : Common.Timestamp;
    notes : Text;
  };

  public type ActivityType = {
    #call;
    #email;
    #meeting;
    #task;
  };

  public type Activity = {
    id : ActivityId;
    activityType : ActivityType;
    description : Text;
    contactId : ContactId;
    dealId : ?DealId;
    dueDate : Common.Timestamp;
    completedAt : ?Common.Timestamp;
    createdBy : Common.UserId;
    createdAt : Common.Timestamp;
  };
};
