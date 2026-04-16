import ErpTypes "../types/erp";
import Common "../types/common";
import ErpLib "../lib/erp";
import Map "mo:core/Map";

mixin (
  invoices : Map.Map<ErpTypes.InvoiceId, ErpTypes.Invoice>,
  nextInvoiceId : { var value : Nat },
  roles : Map.Map<Common.UserId, Common.Role>,
) {
  public shared query func listInvoices() : async [ErpTypes.Invoice] {
    ErpLib.listInvoices(invoices);
  };

  public shared query func getInvoice(id : ErpTypes.InvoiceId) : async ?ErpTypes.Invoice {
    ErpLib.getInvoice(invoices, id);
  };

  public shared ({ caller }) func createInvoice(
    contactId : Common.EntityId,
    dealId : ?Common.EntityId,
    lineItems : [ErpTypes.InvoiceLineItem],
    dueDate : Common.Timestamp,
  ) : async ErpTypes.Invoice {
    ErpLib.requireAnyRole(roles, caller, [#admin, #finance]);
    ErpLib.createInvoice(invoices, nextInvoiceId, contactId, dealId, lineItems, dueDate);
  };

  public shared ({ caller }) func updateInvoiceStatus(
    id : ErpTypes.InvoiceId,
    status : ErpTypes.InvoiceStatus,
    paidAt : ?Common.Timestamp,
  ) : async ?ErpTypes.Invoice {
    ErpLib.requireAnyRole(roles, caller, [#admin, #finance]);
    ErpLib.updateInvoiceStatus(invoices, id, status, paidAt);
  };

  public shared ({ caller }) func deleteInvoice(id : ErpTypes.InvoiceId) : async Bool {
    ErpLib.requireAnyRole(roles, caller, [#admin, #finance]);
    ErpLib.deleteInvoice(invoices, id);
  };
};
