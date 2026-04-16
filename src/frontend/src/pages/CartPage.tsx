import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../hooks/use-cart";

function formatPrice(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

const SHIPPING_THRESHOLD = 10000n; // $100 in cents
const SHIPPING_COST = 999n; // $9.99 in cents

function CartItemRow({
  item,
  index,
  onRemove,
  onUpdateQty,
}: {
  item: ReturnType<typeof useCart>["items"][number];
  index: number;
  onRemove: (id: bigint) => void;
  onUpdateQty: (id: bigint, qty: number) => void;
}) {
  const subtotal = item.price * BigInt(item.quantity);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.06, duration: 0.28 }}
      data-ocid={`cart.item.${index + 1}`}
      className="flex gap-4 p-4 items-start"
    >
      {/* Product image */}
      <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted border border-border">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display font-semibold text-foreground leading-tight truncate pr-2">
            {item.title}
          </p>
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">
            {formatPrice(subtotal)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatPrice(item.price)} each
        </p>

        <div className="flex items-center gap-3 mt-1">
          {/* Quantity stepper */}
          <div
            className="flex items-center gap-1 border border-border rounded-lg overflow-hidden bg-background"
            data-ocid={`cart.qty_stepper.${index + 1}`}
          >
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
              onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
              aria-label="Decrease quantity"
              data-ocid={`cart.qty_decrease.${index + 1}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-foreground select-none">
              {item.quantity}
            </span>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
              onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
              aria-label="Increase quantity"
              data-ocid={`cart.qty_increase.${index + 1}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors duration-150 ml-auto"
            onClick={() => onRemove(item.productId)}
            aria-label={`Remove ${item.title}`}
            data-ocid={`cart.delete_button.${index + 1}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-ocid="cart.empty_state"
      className="flex flex-col items-center justify-center py-24 px-8 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <ShoppingBag className="w-9 h-9 text-muted-foreground" />
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        Looks like you haven't added anything yet. Browse our catalog and find
        something you love.
      </p>
      <Button
        onClick={() => navigate({ to: "/catalog" })}
        data-ocid="cart.browse_catalog_button"
      >
        Browse Catalog
      </Button>
    </motion.div>
  );
}

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0n : SHIPPING_COST;
  const total = totalPrice + shipping;
  const freeShippingRemaining = SHIPPING_THRESHOLD - totalPrice;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Shopping Cart
            </h1>
            {items.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {items.length} {items.length === 1 ? "item" : "items"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Cart Items */}
            <div data-ocid="cart.list">
              <Card className="overflow-hidden divide-y divide-border shadow-subtle">
                <AnimatePresence mode="popLayout">
                  {items.map((item, idx) => (
                    <CartItemRow
                      key={item.productId.toString()}
                      item={item}
                      index={idx}
                      onRemove={removeItem}
                      onUpdateQty={updateQuantity}
                    />
                  ))}
                </AnimatePresence>
              </Card>

              {/* Free shipping progress */}
              {shipping > 0n && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-2"
                >
                  <span className="text-sm text-foreground">
                    Add{" "}
                    <span className="font-semibold text-primary">
                      {formatPrice(freeShippingRemaining)}
                    </span>{" "}
                    more for free shipping
                  </span>
                </motion.div>
              )}
              {shipping === 0n && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-2"
                >
                  <span className="text-sm font-medium text-foreground">
                    🎉 You qualify for free shipping!
                  </span>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              data-ocid="cart.order_summary"
              className="lg:sticky lg:top-24"
            >
              <Card className="p-6 shadow-elevated">
                <h2 className="font-display text-lg font-bold text-foreground mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Subtotal ({items.reduce((s, i) => s + i.quantity, 0)}{" "}
                      {items.reduce((s, i) => s + i.quantity, 0) === 1
                        ? "item"
                        : "items"}
                      )
                    </span>
                    <span className="text-foreground font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping estimate</span>
                    <span
                      className={
                        shipping === 0n
                          ? "text-accent font-semibold"
                          : "text-foreground font-medium"
                      }
                    >
                      {shipping === 0n ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-base font-bold text-foreground pt-1">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 h-12 text-base font-semibold"
                  onClick={() => navigate({ to: "/checkout" })}
                  data-ocid="cart.checkout_button"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="ghost"
                  className="w-full mt-2 text-muted-foreground"
                  onClick={() => navigate({ to: "/catalog" })}
                  data-ocid="cart.continue_shopping_button"
                >
                  Continue Shopping
                </Button>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
