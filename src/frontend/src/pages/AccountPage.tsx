import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Heart, LogOut, ShoppingBag, User } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "../hooks/use-auth";
import {
  useGetProduct,
  useGetWishlist,
  useRemoveFromWishlist,
} from "../hooks/use-backend";

// ─── Wishlist item fetcher ───────────────────────────────────────────────────

function WishlistItem({
  productId,
  index,
  onRemove,
}: {
  productId: bigint;
  index: number;
  onRemove: (id: bigint) => void;
}) {
  const { data: product, isLoading } = useGetProduct(productId);

  if (isLoading) {
    return <Skeleton className="aspect-[4/3] rounded-xl" />;
  }

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      className="relative group"
    >
      <ProductCard product={product as Product} index={index} />
      <button
        onClick={() => onRemove(productId)}
        type="button"
        aria-label="Remove from wishlist"
        data-ocid={`account.wishlist.remove_button.${index + 1}`}
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
      >
        <Heart className="size-3.5 fill-current" />
      </button>
    </motion.div>
  );
}

// ─── Wishlist section ────────────────────────────────────────────────────────

function WishlistSection() {
  const { data: wishlist, isLoading } = useGetWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleRemove = (productId: bigint) => {
    removeFromWishlist.mutate(productId, {
      onSuccess: () => toast.success("Removed from wishlist"),
      onError: () => toast.error("Could not remove item"),
    });
  };

  const productIds = wishlist?.productIds ?? [];

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5">
        <Heart className="size-5 text-chart-5" />
        <h2 className="font-display text-xl font-semibold text-foreground">
          Wishlist
        </h2>
        {productIds.length > 0 && (
          <span className="text-xs font-semibold bg-chart-5/10 text-chart-5 border border-chart-5/20 px-2 py-0.5 rounded-full">
            {productIds.length}
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="account.wishlist.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {Array.from({ length: 3 }, (_, i) => `wskel-${i}`).map((k) => (
            <Skeleton key={k} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      )}

      {/* Wishlist grid */}
      {!isLoading && productIds.length > 0 && (
        <div
          data-ocid="account.wishlist.list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {productIds.map((id, i) => (
            <WishlistItem
              key={id.toString()}
              productId={id}
              index={i}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && productIds.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          data-ocid="account.wishlist.empty_state"
          className="flex flex-col items-center gap-5 py-14 px-8 text-center rounded-xl border border-dashed border-border bg-muted/30"
        >
          <div className="w-14 h-14 rounded-full bg-chart-5/10 flex items-center justify-center">
            <Heart className="size-6 text-chart-5" />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="font-display font-semibold text-foreground">
              Your wishlist is empty
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Save products you love by tapping the heart icon on any product
              page.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            data-ocid="account.wishlist.browse_button"
          >
            <Link to="/catalog">
              <ShoppingBag className="size-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </motion.div>
      )}
    </section>
  );
}

// ─── Profile section ─────────────────────────────────────────────────────────

function ProfileSection() {
  const { principal, logout } = useAuth();

  const principalText = principal?.toText() ?? "";
  const truncated =
    principalText.length > 20
      ? `${principalText.slice(0, 10)}…${principalText.slice(-8)}`
      : principalText;

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="size-6 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-semibold text-foreground text-base leading-tight">
            My Account
          </p>
          <p
            className="text-xs text-muted-foreground font-mono mt-0.5 truncate"
            title={principalText}
            data-ocid="account.principal_id"
          >
            {truncated}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={logout}
        className="shrink-0 gap-2"
        data-ocid="account.logout_button"
      >
        <LogOut className="size-3.5" />
        Sign Out
      </Button>
    </motion.section>
  );
}

// ─── Login prompt ────────────────────────────────────────────────────────────

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div
      data-ocid="account.login_prompt"
      className="flex flex-col items-center justify-center gap-6 min-h-[60vh] px-8 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <User className="size-9 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Sign in to your account
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          View your profile and wishlist by signing in with Internet Identity.
        </p>
      </div>
      <Button onClick={onLogin} data-ocid="account.login_button">
        Sign In
      </Button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();

  if (!authLoading && !isAuthenticated) {
    return <LoginPrompt onLogin={login} />;
  }

  if (authLoading) {
    return (
      <div
        data-ocid="account.loading_state"
        className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10"
      >
        <Skeleton className="h-24 rounded-xl mb-8" />
        <Skeleton className="h-6 w-32 mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }, (_, i) => `askel-${i}`).map((k) => (
            <Skeleton key={k} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="account.page"
      className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-8"
    >
      {/* Page title */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Account
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Manage your profile and saved items
        </p>
      </div>

      {/* Profile card */}
      <ProfileSection />

      <Separator />

      {/* Wishlist */}
      <WishlistSection />
    </div>
  );
}
