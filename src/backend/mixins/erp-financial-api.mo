import ErpTypes "../types/erp";
import Common "../types/common";
import ErpLib "../lib/erp";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  invoices : Map.Map<ErpTypes.InvoiceId, ErpTypes.Invoice>,
  purchaseOrders : Map.Map<ErpTypes.PurchaseOrderId, ErpTypes.PurchaseOrder>,
  products : Map.Map<ErpTypes.ProductId, ErpTypes.Product>,
  roles : Map.Map<Common.UserId, Common.Role>,
) {
  public type FinancialSummary = {
    totalRevenue : Nat;
    totalExpenses : Nat;
    cashBalance : Int;
    grossMargin : Nat;
    outstandingReceivables : Nat;
    inventoryValue : Nat;
  };

  public shared query func getFinancialSummary() : async FinancialSummary {
    let revenue = ErpLib.totalRevenue(invoices);
    let expenses = ErpLib.totalExpenses(purchaseOrders);
    let cashBalance : Int = revenue.toInt() - expenses.toInt();
    let grossMargin = if (revenue > 0) {
      (revenue - (if (expenses < revenue) expenses else revenue)) * 100 / revenue;
    } else 0;
    {
      totalRevenue = revenue;
      totalExpenses = expenses;
      cashBalance;
      grossMargin;
      outstandingReceivables = ErpLib.totalOutstandingReceivables(invoices);
      inventoryValue = ErpLib.totalInventoryValue(products);
    };
  };

  public shared query func getRevenueByPeriod(months : Nat) : async [(Text, Nat)] {
    ErpLib.revenueByPeriod(invoices, months, Time.now());
  };
};
