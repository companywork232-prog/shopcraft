import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Edit2,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "../components/ProductCard";
import { useAuth } from "../hooks/use-auth";
import {
  useCreateProduct,
  useDeleteProduct,
  useIsAdmin,
  useListProducts,
  useUpdateProduct,
} from "../hooks/use-backend";
import type { Product } from "../types";
import { CATEGORIES } from "../types";

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  inventory: string;
  imageUrl: string;
}

const EMPTY_FORM: ProductFormData = {
  title: "",
  description: "",
  price: "",
  category: CATEGORIES[0],
  inventory: "0",
  imageUrl: "",
};

function productToForm(p: Product): ProductFormData {
  return {
    title: p.title,
    description: p.description,
    price: (Number(p.price) / 100).toFixed(2),
    category: p.category,
    inventory: String(p.inventoryCount),
    imageUrl: p.images[0] ?? "",
  };
}

function ProductFormDialog({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing: Product | null;
}) {
  const [form, setForm] = useState<ProductFormData>(
    editing ? productToForm(editing) : EMPTY_FORM,
  );
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const set = (key: keyof ProductFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceInCents = Math.round(Number.parseFloat(form.price) * 100);
    if (Number.isNaN(priceInCents) || priceInCents <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      inventoryCount: Math.max(0, Number.parseInt(form.inventory) || 0),
      price: priceInCents,
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
    };
    try {
      if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, input: payload });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(payload);
        toast.success("Product created");
      }
      onClose();
    } catch {
      toast.error("Failed to save product");
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg" data-ocid="admin_products.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="prod-title">Title</Label>
            <Input
              id="prod-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Product name"
              required
              data-ocid="admin_products.title.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prod-desc">Description</Label>
            <Textarea
              id="prod-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the product..."
              rows={3}
              required
              data-ocid="admin_products.description.textarea"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prod-price">Price (USD)</Label>
              <Input
                id="prod-price"
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="29.99"
                required
                data-ocid="admin_products.price.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-inv">Inventory</Label>
              <Input
                id="prod-inv"
                type="number"
                min="0"
                value={form.inventory}
                onChange={(e) => set("inventory", e.target.value)}
                placeholder="0"
                required
                data-ocid="admin_products.inventory.input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prod-cat">Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v)}
            >
              <SelectTrigger
                id="prod-cat"
                data-ocid="admin_products.category.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prod-img">Image URL</Label>
            <Input
              id="prod-img"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://..."
              data-ocid="admin_products.image_url.input"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              data-ocid="admin_products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="admin_products.submit_button"
            >
              {isPending
                ? "Saving…"
                : editing
                  ? "Save Changes"
                  : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProductsPage() {
  const { isAuthenticated, principal } = useAuth();
  const principalStr = principal?.toText();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin(principalStr);
  const { data: productData, isLoading } = useListProducts({ pageSize: 100 });
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const products = productData?.items ?? [];

  const openCreate = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    try {
      await deleteProduct.mutateAsync(deletingId);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated || (!isAdminLoading && !isAdmin)) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8"
        data-ocid="admin_products.error_state"
      >
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="size-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You don&apos;t have admin privileges to access this page.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Back to Store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      data-ocid="admin_products.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link to="/admin" data-ocid="admin_products.link">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Products
              </h1>
              <p className="text-sm text-muted-foreground">
                {products.length} total listings
              </p>
            </div>
          </div>
        </div>
        <Button onClick={openCreate} data-ocid="admin_products.add_button">
          <Plus className="size-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="admin_products.loading_state">
          {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((k) => (
            <Skeleton key={k} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card
          className="p-16 flex flex-col items-center gap-4 text-center"
          data-ocid="admin_products.empty_state"
        >
          <div className="size-14 rounded-full bg-muted flex items-center justify-center">
            <Package className="size-7 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              No products yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first product to get started.
            </p>
          </div>
          <Button
            onClick={openCreate}
            data-ocid="admin_products.primary_button"
          >
            <Plus className="size-4 mr-2" /> Add Product
          </Button>
        </Card>
      ) : (
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-12">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Inventory
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr
                    key={product.id.toString()}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`admin_products.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="size-10 rounded-lg overflow-hidden bg-muted/50 border border-border shrink-0">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="size-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground line-clamp-1 max-w-xs">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                        {product.description}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground tabular-nums">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span
                        className={
                          product.inventoryCount === 0n
                            ? "text-destructive font-semibold"
                            : "text-foreground"
                        }
                      >
                        {String(product.inventoryCount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => openEdit(product)}
                          data-ocid={`admin_products.edit_button.${idx + 1}`}
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingId(product.id)}
                          data-ocid={`admin_products.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Product Form Dialog */}
      {dialogOpen && (
        <ProductFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          editing={editingProduct}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(v) => !v && setDeletingId(null)}
      >
        <AlertDialogContent data-ocid="admin_products.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_products.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin_products.confirm_button"
            >
              {deleteProduct.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
