import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CategoryBadge } from "../components/CategoryBadge";
import { ProductCard, formatPrice } from "../components/ProductCard";
import {
  useAddToCart,
  useAddToWishlist,
  useGetProduct,
  useListProducts,
} from "../hooks/use-backend";
import { useCart } from "../hooks/use-cart";

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Skeleton className="h-5 w-32 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-20 h-16 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <div className="flex gap-3 mt-4">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="h-11 w-11" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const safeImages =
    images.length > 0 ? images : ["/assets/images/placeholder.svg"];

  const prev = () =>
    setActive((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setActive((i) => (i + 1) % safeImages.length);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] bg-muted/40 rounded-xl overflow-hidden border border-border">
        <img
          src={safeImages[active]}
          alt={`${title} – view ${active + 1}`}
          className="w-full h-full object-cover"
        />
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              data-ocid="product.gallery_prev"
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card border border-border rounded-full p-1.5 shadow-subtle transition-smooth"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={next}
              data-ocid="product.gallery_next"
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card border border-border rounded-full p-1.5 shadow-subtle transition-smooth"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              data-ocid={`product.thumbnail.${i + 1}`}
              className={cn(
                "w-20 h-16 rounded-lg overflow-hidden border-2 transition-smooth shrink-0",
                active === i
                  ? "border-primary"
                  : "border-border hover:border-foreground/30",
              )}
              aria-label={`View ${i + 1}`}
            >
              <img
                src={src}
                alt={`${title} view ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const productId = BigInt(id ?? "0");

  const { data: productResult, isLoading } = useGetProduct(productId);
  const product = Array.isArray(productResult)
    ? (productResult[0] ?? null)
    : (productResult ?? null);

  const [quantity, setQuantity] = useState(1);
  const { addItem, isInCart } = useCart();
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();

  const { data: relatedResult } = useListProducts({
    category: product?.category,
    pageSize: 4,
    page: 0,
  });

  const relatedProducts = (relatedResult?.items ?? [])
    .filter((p) => p.id !== product?.id)
    .slice(0, 4);

  if (isLoading) return <DetailSkeleton />;

  if (!product) {
    return (
      <div
        data-ocid="product.error_state"
        className="flex flex-col items-center justify-center gap-4 min-h-[60vh] text-center px-4"
      >
        <XCircle className="size-12 text-destructive/60" />
        <h2 className="font-display text-xl font-semibold text-foreground">
          Product not found
        </h2>
        <p className="text-muted-foreground text-sm">
          This product may have been removed or the link is incorrect.
        </p>
        <Button asChild variant="outline" data-ocid="product.back_button">
          <Link to="/catalog">Browse Catalog</Link>
        </Button>
      </div>
    );
  }

  const inStock = product.inventoryCount > 0n;
  const inCart = isInCart(product.id);
  const maxQty = Math.min(Number(product.inventoryCount), 10);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] ?? "",
    });
    for (let i = 1; i < quantity; i++) {
      addItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] ?? "",
      });
    }
    toast.success(`${product.title} added to cart`);
  };

  const handleAddToWishlist = () => {
    addToWishlistMutation.mutate(product.id, {
      onSuccess: () => toast.success("Added to wishlist"),
      onError: () => toast.error("Sign in to save to wishlist"),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav
            className="flex items-center gap-2 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link
              to="/catalog"
              data-ocid="product.back_link"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Catalog
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-xs">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <ImageGallery images={product.images} title={product.title} />

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            {/* Category + title */}
            <div className="flex flex-col gap-2">
              <CategoryBadge category={product.category} />
              <h1
                data-ocid="product.title"
                className="font-display text-3xl font-bold text-foreground leading-tight"
              >
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                data-ocid="product.price"
                className="font-display text-4xl font-bold text-foreground"
              >
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Inventory status */}
            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle2 className="size-4 text-accent shrink-0" />
                  <span
                    data-ocid="product.inventory_status"
                    className="text-sm font-medium text-accent"
                  >
                    In Stock
                    {product.inventoryCount <= 5n && (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        — only {product.inventoryCount.toString()} left
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="size-4 text-destructive shrink-0" />
                  <span
                    data-ocid="product.inventory_status"
                    className="text-sm font-medium text-destructive"
                  >
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Sold count */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                🛒 {Number(product.soldCount)} sold
              </Badge>
            </div>

            {/* Quantity + Add to cart */}
            {inStock && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    Quantity
                  </span>
                  <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      data-ocid="product.qty_minus"
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span
                      data-ocid="product.qty_value"
                      className="w-10 text-center font-semibold text-sm"
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(maxQty, q + 1))
                      }
                      disabled={quantity >= maxQty}
                      data-ocid="product.qty_plus"
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 gap-2"
                    variant={inCart ? "secondary" : "default"}
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending}
                    data-ocid="product.add_to_cart_button"
                  >
                    <ShoppingCart className="size-4" />
                    {inCart ? "Add More" : "Add to Cart"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                    onClick={handleAddToWishlist}
                    disabled={addToWishlistMutation.isPending}
                    data-ocid="product.wishlist_button"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="size-4" />
                  </Button>
                </div>

                {inCart && (
                  <Link to="/cart">
                    <Button
                      variant="outline"
                      className="w-full"
                      data-ocid="product.view_cart_link"
                    >
                      View Cart
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {!inStock && (
              <Button
                size="lg"
                variant="outline"
                disabled
                data-ocid="product.out_of_stock_button"
                className="opacity-60"
              >
                Out of Stock
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-muted/30 border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              data-ocid="product.related_section"
              className="font-display text-2xl font-bold text-foreground mb-6"
            >
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id.toString()} product={p} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
