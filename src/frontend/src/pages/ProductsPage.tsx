import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../components/EmptyState";
import { PageLoader } from "../components/LoadingSpinner";
import { PageHeader } from "../components/PageHeader";
import {
  useAdjustStock,
  useCreateProduct,
  useDeleteProduct,
  useListProducts,
} from "../hooks/use-backend";
import { type Product, formatCurrency } from "../types";

function StockCell({ product }: { product: Product }) {
  const isLow = product.stockQuantity <= product.reorderThreshold;
  return (
    <div className="flex items-center gap-2">
      <span
        className={`font-mono text-sm ${isLow ? "text-destructive font-semibold" : "text-foreground"}`}
      >
        {product.stockQuantity.toString()}
      </span>
      {isLow && (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
          Low
        </Badge>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const { data: products = [], isLoading } = useListProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const adjustStock = useAdjustStock();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [adjustId, setAdjustId] = useState<bigint | null>(null);
  const [delta, setDelta] = useState("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    costPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    reorderThreshold: "",
    category: "",
  });

  const filtered = products.filter((p) =>
    [p.name, p.sku, p.category].some((f) =>
      f.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync({
        name: form.name,
        sku: form.sku,
        costPrice: BigInt(Math.round(Number.parseFloat(form.costPrice) * 100)),
        sellingPrice: BigInt(
          Math.round(Number.parseFloat(form.sellingPrice) * 100),
        ),
        stockQuantity: BigInt(form.stockQuantity),
        reorderThreshold: BigInt(form.reorderThreshold),
        category: form.category,
      });
      toast.success("Product created");
      setOpen(false);
      setForm({
        name: "",
        sku: "",
        costPrice: "",
        sellingPrice: "",
        stockQuantity: "",
        reorderThreshold: "",
        category: "",
      });
    } catch {
      toast.error("Failed to create product");
    }
  };

  const handleAdjust = async () => {
    if (!adjustId || !delta) return;
    try {
      await adjustStock.mutateAsync({ id: adjustId, delta: BigInt(delta) });
      toast.success("Stock adjusted");
      setAdjustId(null);
      setDelta("");
    } catch {
      toast.error("Failed to adjust stock");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) return <PageLoader label="Loading products…" />;

  const adjustingProduct = products.find((p) => p.id === adjustId);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6" data-ocid="products.page">
      <PageHeader
        title="Products"
        description={`${products.length} products in inventory`}
        action={{
          label: "Add Product",
          onClick: () => setOpen(true),
          icon: <Plus className="size-4" />,
          "data-ocid": "products.add_button",
        }}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="products.search_input"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="size-8" />}
          title={search ? "No products match" : "No products yet"}
          description={
            search
              ? "Try adjusting your search."
              : "Add products to manage your inventory."
          }
          action={
            !search
              ? {
                  label: "Add Product",
                  onClick: () => setOpen(true),
                  "data-ocid": "products.empty_state.add_button",
                }
              : undefined
          }
          data-ocid="products.empty_state"
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden shadow-subtle">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p, i) => (
                <TableRow
                  key={p.id.toString()}
                  data-ocid={`products.item.${i + 1}`}
                >
                  <TableCell className="font-medium text-sm">
                    {p.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.sku}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {p.category}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {formatCurrency(p.costPrice)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatCurrency(p.sellingPrice)}
                  </TableCell>
                  <TableCell>
                    <StockCell product={p} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => {
                          setAdjustId(p.id);
                          setDelta("");
                        }}
                        data-ocid={`products.adjust_button.${i + 1}`}
                      >
                        Adjust
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive/60 hover:text-destructive"
                        onClick={() => handleDelete(p.id)}
                        data-ocid={`products.delete_button.${i + 1}`}
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Product Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" data-ocid="products.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="p-name">Name *</Label>
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  data-ocid="products.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-sku">SKU *</Label>
                <Input
                  id="p-sku"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  required
                  data-ocid="products.sku.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-cat">Category</Label>
                <Input
                  id="p-cat"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  data-ocid="products.category.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-cost">Cost price ($) *</Label>
                <Input
                  id="p-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.costPrice}
                  onChange={(e) =>
                    setForm({ ...form, costPrice: e.target.value })
                  }
                  required
                  data-ocid="products.cost_price.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-sell">Selling price ($) *</Label>
                <Input
                  id="p-sell"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={(e) =>
                    setForm({ ...form, sellingPrice: e.target.value })
                  }
                  required
                  data-ocid="products.selling_price.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-qty">Stock qty *</Label>
                <Input
                  id="p-qty"
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(e) =>
                    setForm({ ...form, stockQuantity: e.target.value })
                  }
                  required
                  data-ocid="products.stock_qty.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-threshold">Reorder threshold *</Label>
                <Input
                  id="p-threshold"
                  type="number"
                  min="0"
                  value={form.reorderThreshold}
                  onChange={(e) =>
                    setForm({ ...form, reorderThreshold: e.target.value })
                  }
                  required
                  data-ocid="products.reorder_threshold.input"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="products.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProduct.isPending}
                data-ocid="products.submit_button"
              >
                {createProduct.isPending ? "Creating…" : "Create Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog
        open={adjustId !== null}
        onOpenChange={(o) => !o && setAdjustId(null)}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="products.adjust_stock.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Adjust Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">
              {adjustingProduct?.name} — current stock:{" "}
              <strong>{adjustingProduct?.stockQuantity.toString()}</strong>
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="adj-delta">
                Delta (use negative to decrease)
              </Label>
              <Input
                id="adj-delta"
                type="number"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                placeholder="+10 or -5"
                data-ocid="products.stock_delta.input"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdjustId(null)}
                data-ocid="products.adjust_cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdjust}
                disabled={!delta || adjustStock.isPending}
                data-ocid="products.adjust_confirm_button"
              >
                {adjustStock.isPending ? "Adjusting…" : "Apply"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
