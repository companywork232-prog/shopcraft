import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../components/EmptyState";
import { PageLoader } from "../components/LoadingSpinner";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import {
  useCreatePurchaseOrder,
  useListProducts,
  useListPurchaseOrders,
  useUpdatePurchaseOrderStatus,
} from "../hooks/use-backend";
import {
  type PurchaseLineItem,
  PurchaseOrderStatus,
  formatDate,
} from "../types";

const STATUS_OPTIONS = [
  { value: PurchaseOrderStatus.draft, label: "Draft" },
  { value: PurchaseOrderStatus.submitted, label: "Submitted" },
  { value: PurchaseOrderStatus.received, label: "Received" },
  { value: PurchaseOrderStatus.cancelled, label: "Cancelled" },
];

export default function PurchaseOrdersPage() {
  const { data: orders = [], isLoading } = useListPurchaseOrders();
  const { data: products = [] } = useListProducts();
  const createPO = useCreatePurchaseOrder();
  const updateStatus = useUpdatePurchaseOrderStatus();
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [lineItems, setLineItems] = useState<
    Array<{ productId: string; quantity: string; unitCost: string }>
  >([{ productId: "", quantity: "", unitCost: "" }]);

  const addLine = () =>
    setLineItems((prev) => [
      ...prev,
      { productId: "", quantity: "", unitCost: "" },
    ]);
  const removeLine = (idx: number) =>
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  const updateLine = (idx: number, field: string, value: string) =>
    setLineItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validLines = lineItems.filter(
      (l) => l.productId && l.quantity && l.unitCost,
    );
    if (validLines.length === 0) {
      toast.error("Add at least one line item");
      return;
    }
    try {
      const items: PurchaseLineItem[] = validLines.map((l) => ({
        productId: BigInt(l.productId),
        quantity: BigInt(l.quantity),
        unitCost: BigInt(Math.round(Number.parseFloat(l.unitCost) * 100)),
      }));
      const deliveryMs = new Date(expectedDelivery).getTime();
      await createPO.mutateAsync({
        vendor,
        lineItems: items,
        expectedDelivery: BigInt(deliveryMs) * 1_000_000n,
      });
      toast.success("Purchase order created");
      setOpen(false);
      setVendor("");
      setExpectedDelivery("");
      setLineItems([{ productId: "", quantity: "", unitCost: "" }]);
    } catch {
      toast.error("Failed to create purchase order");
    }
  };

  const handleStatusChange = async (
    id: bigint,
    status: PurchaseOrderStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) return <PageLoader label="Loading purchase orders…" />;

  return (
    <div
      className="p-6 max-w-6xl mx-auto space-y-6"
      data-ocid="purchase_orders.page"
    >
      <PageHeader
        title="Purchase Orders"
        description={`${orders.length} total purchase orders`}
        action={{
          label: "New PO",
          onClick: () => setOpen(true),
          icon: <Plus className="size-4" />,
          "data-ocid": "purchase_orders.add_button",
        }}
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="size-8" />}
          title="No purchase orders"
          description="Create a purchase order to restock your inventory."
          action={{
            label: "New PO",
            onClick: () => setOpen(true),
            "data-ocid": "purchase_orders.empty_state.add_button",
          }}
          data-ocid="purchase_orders.empty_state"
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden shadow-subtle">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>PO #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="hidden md:table-cell">Items</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Expected Delivery
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-40">Change Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((po, i) => (
                <TableRow
                  key={po.id.toString()}
                  data-ocid={`purchase_orders.item.${i + 1}`}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    PO-{po.id.toString().padStart(4, "0")}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {po.vendor}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {po.lineItems.length} items
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(po.expectedDelivery)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge type="purchase-order" value={po.status} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={po.status}
                      onValueChange={(v) =>
                        handleStatusChange(po.id, v as PurchaseOrderStatus)
                      }
                    >
                      <SelectTrigger
                        className="h-7 text-xs"
                        data-ocid={`purchase_orders.status.select.${i + 1}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create PO Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg" data-ocid="purchase_orders.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              New Purchase Order
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="po-vendor">Vendor *</Label>
                <Input
                  id="po-vendor"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  required
                  data-ocid="purchase_orders.vendor.input"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="po-delivery">Expected delivery *</Label>
                <Input
                  id="po-delivery"
                  type="date"
                  value={expectedDelivery}
                  onChange={(e) => setExpectedDelivery(e.target.value)}
                  required
                  data-ocid="purchase_orders.delivery_date.input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Line Items</Label>
              {lineItems.map((line, idx) => (
                <div
                  key={`line-item-${line.productId || idx}-${idx}`}
                  className="flex gap-2 items-end"
                >
                  <div className="flex-1 space-y-1">
                    <Select
                      value={line.productId}
                      onValueChange={(v) => updateLine(idx, "productId", v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem
                            key={p.id.toString()}
                            value={p.id.toString()}
                          >
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder="Qty"
                    type="number"
                    min="1"
                    className="w-16 h-8 text-xs"
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(idx, "quantity", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Cost $"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-20 h-8 text-xs"
                    value={line.unitCost}
                    onChange={(e) =>
                      updateLine(idx, "unitCost", e.target.value)
                    }
                  />
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => removeLine(idx)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={addLine}
              >
                + Add line
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="purchase_orders.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPO.isPending}
                data-ocid="purchase_orders.submit_button"
              >
                {createPO.isPending ? "Creating…" : "Create PO"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
