module {
  public type EntityId = Nat;
  public type Timestamp = Int; // nanoseconds from Time.now()
  public type UserId = Principal;

  public type Role = {
    #admin;
    #sales_rep;
    #finance;
    #manager;
  };
};
