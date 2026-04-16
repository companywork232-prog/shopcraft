import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../hooks/use-cart";
import { CategoryBadge } from "./CategoryBadge";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export function formatPrice(priceInCents: bigint): string {
  const dollars = Number(priceInCents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

export function ProductCard({
  product,
  index = 0,
  className,
}: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] ?? "",
    });
    toast.success(`${product.title} added to cart`);
  };

  const imageUrl = product.images[0] || "/assets/images/placeholder.svg";

  return (
    <Link
      to="/products/$id"
      params={{ id: product.id.toString() }}
      data-ocid={`product.item.${index + 1}`}
      className={cn(
        "group block rounded-xl border border-border bg-card overflow-hidden",
        "hover:shadow-elevated transition-smooth hover:-translate-y-1",
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted/40 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        {product.inventoryCount === 0n && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground bg-card px-3 py-1 rounded-full border">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <CategoryBadge category={product.category} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-display font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Stars + sold count */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={cn(
                "size-3.5",
                s <= 4 ? "fill-chart-5 text-chart-5" : "fill-muted text-muted",
              )}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({Number(product.soldCount)} sold)
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <span className="font-display font-bold text-lg text-foreground">
            {formatPrice(product.price)}
          </span>
          <Button
            size="sm"
            variant={inCart ? "secondary" : "default"}
            className="gap-1.5 shrink-0"
            onClick={handleAddToCart}
            disabled={product.inventoryCount === 0n}
            data-ocid={`product.add_button.${index + 1}`}
          >
            <ShoppingCart className="size-3.5" />
            {inCart ? "In Cart" : "Add"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
