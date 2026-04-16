import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateOrder } from "../hooks/use-backend";
import { useCart } from "../hooks/use-cart";

function formatPrice(cents: bigint): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(cents) / 100);
}

const SHIPPING_THRESHOLD = 10000n;
const SHIPPING_COST = 999n;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingForm {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentForm {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

type Step = 1 | 2 | 3;

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: Package },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  return (
    <div
      className="flex items-center justify-center gap-0"
      data-ocid="checkout.step_indicator"
    >
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mb-5 mx-2 transition-colors duration-300 ${
                  current > step.id ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Shipping ─────────────────────────────────────────────────────────

function ShippingStep({
  form,
  onChange,
  onNext,
}: {
  form: ShippingForm;
  onChange: (f: ShippingForm) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});

  const validate = () => {
    const e: Partial<ShippingForm> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.street.trim()) e.street = "Street address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State / province is required";
    if (!form.zip.trim()) e.zip = "ZIP / postal code is required";
    if (!form.country.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const field = (
    id: keyof ShippingForm,
    label: string,
    placeholder: string,
    colSpan?: string,
  ) => (
    <div className={`flex flex-col gap-1.5 ${colSpan ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={placeholder}
        value={form[id]}
        onChange={(e) => {
          onChange({ ...form, [id]: e.target.value });
          if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
        }}
        onBlur={() => {
          if (!form[id].trim())
            setErrors((prev) => ({ ...prev, [id]: `${label} is required` }));
        }}
        className={errors[id] ? "border-destructive" : ""}
        data-ocid={`checkout.shipping_${id}_input`}
      />
      {errors[id] && (
        <p
          className="text-xs text-destructive"
          data-ocid={`checkout.shipping_${id}_field_error`}
        >
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("name", "Full Name", "Jane Doe", "sm:col-span-2")}
        {field(
          "street",
          "Street Address",
          "123 Main St, Apt 4B",
          "sm:col-span-2",
        )}
        {field("city", "City", "New York")}
        {field("state", "State / Province", "NY")}
        {field("zip", "ZIP / Postal Code", "10001")}
        {field("country", "Country", "United States")}
      </div>

      <Button
        className="w-full mt-6 h-12 text-base font-semibold"
        onClick={handleNext}
        data-ocid="checkout.shipping_next_button"
      >
        Continue to Payment
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </motion.div>
  );
}

// ─── Step 2: Payment ──────────────────────────────────────────────────────────

function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function PaymentStep({
  form,
  onChange,
  onNext,
  onBack,
}: {
  form: PaymentForm;
  onChange: (f: PaymentForm) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<PaymentForm>>({});

  const validate = () => {
    const e: Partial<PaymentForm> = {};
    if (form.cardNumber.replace(/\s/g, "").length < 16)
      e.cardNumber = "Valid card number required";
    if (form.expiry.length < 5) e.expiry = "Valid expiry required (MM/YY)";
    if (form.cvv.length < 3) e.cvv = "CVV must be 3–4 digits";
    if (!form.nameOnCard.trim()) e.nameOnCard = "Name on card is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      {/* Mock card preview */}
      <div className="rounded-2xl gradient-primary p-5 text-white mb-6 relative overflow-hidden shadow-elevated">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 translate-y-10 -translate-x-10" />
        <CreditCard className="w-8 h-8 mb-4 opacity-90" />
        <p className="font-mono text-lg tracking-widest mb-3 relative z-10">
          {form.cardNumber || "•••• •••• •••• ••••"}
        </p>
        <div className="flex justify-between text-sm opacity-80 relative z-10">
          <span>{form.nameOnCard || "NAME ON CARD"}</span>
          <span>{form.expiry || "MM/YY"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="nameOnCard">Name on Card</Label>
          <Input
            id="nameOnCard"
            placeholder="Jane Doe"
            value={form.nameOnCard}
            onChange={(e) => {
              onChange({ ...form, nameOnCard: e.target.value });
              if (errors.nameOnCard)
                setErrors((p) => ({ ...p, nameOnCard: undefined }));
            }}
            className={errors.nameOnCard ? "border-destructive" : ""}
            data-ocid="checkout.payment_nameOnCard_input"
          />
          {errors.nameOnCard && (
            <p
              className="text-xs text-destructive"
              data-ocid="checkout.payment_nameOnCard_field_error"
            >
              {errors.nameOnCard}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={form.cardNumber}
            onChange={(e) => {
              onChange({
                ...form,
                cardNumber: formatCardNumber(e.target.value),
              });
              if (errors.cardNumber)
                setErrors((p) => ({ ...p, cardNumber: undefined }));
            }}
            className={`font-mono ${errors.cardNumber ? "border-destructive" : ""}`}
            data-ocid="checkout.payment_cardNumber_input"
          />
          {errors.cardNumber && (
            <p
              className="text-xs text-destructive"
              data-ocid="checkout.payment_cardNumber_field_error"
            >
              {errors.cardNumber}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            value={form.expiry}
            onChange={(e) => {
              onChange({ ...form, expiry: formatExpiry(e.target.value) });
              if (errors.expiry)
                setErrors((p) => ({ ...p, expiry: undefined }));
            }}
            className={errors.expiry ? "border-destructive" : ""}
            data-ocid="checkout.payment_expiry_input"
          />
          {errors.expiry && (
            <p
              className="text-xs text-destructive"
              data-ocid="checkout.payment_expiry_field_error"
            >
              {errors.expiry}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="•••"
            maxLength={4}
            value={form.cvv}
            onChange={(e) => {
              onChange({
                ...form,
                cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
              });
              if (errors.cvv) setErrors((p) => ({ ...p, cvv: undefined }));
            }}
            className={errors.cvv ? "border-destructive" : ""}
            data-ocid="checkout.payment_cvv_input"
          />
          {errors.cvv && (
            <p
              className="text-xs text-destructive"
              data-ocid="checkout.payment_cvv_field_error"
            >
              {errors.cvv}
            </p>
          )}
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4">
        <Lock className="w-3.5 h-3.5" />
        Your payment info is encrypted and secure
      </p>

      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={onBack}
          data-ocid="checkout.payment_back_button"
        >
          Back
        </Button>
        <Button
          className="flex-2 flex-[2] h-12 text-base font-semibold"
          onClick={() => {
            if (validate()) onNext();
          }}
          data-ocid="checkout.payment_next_button"
        >
          Review Order
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Step 3: Review ───────────────────────────────────────────────────────────

function ReviewStep({
  items,
  shipping,
  shippingForm,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  items: ReturnType<typeof useCart>["items"];
  shipping: bigint;
  shippingForm: ShippingForm;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const totalPrice = items.reduce(
    (s, i) => s + i.price * BigInt(i.quantity),
    0n,
  );
  const total = totalPrice + shipping;

  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Shipping summary */}
      <div className="rounded-xl bg-muted/40 border border-border p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Shipping To
        </p>
        <p className="text-sm font-semibold text-foreground">
          {shippingForm.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {shippingForm.street}, {shippingForm.city}, {shippingForm.state}{" "}
          {shippingForm.zip}, {shippingForm.country}
        </p>
      </div>

      {/* Order items */}
      <div className="space-y-2" data-ocid="checkout.review_items_list">
        {items.map((item, idx) => (
          <div
            key={item.productId.toString()}
            className="flex items-center gap-3 py-2"
            data-ocid={`checkout.review_item.${idx + 1}`}
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              {formatPrice(item.price * BigInt(item.quantity))}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      {/* Totals */}
      <div className="space-y-2 text-sm" data-ocid="checkout.review_totals">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span
            className={
              shipping === 0n ? "text-accent font-semibold" : "text-foreground"
            }
          >
            {shipping === 0n ? "Free" : formatPrice(shipping)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-base text-foreground pt-1">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={onBack}
          disabled={isSubmitting}
          data-ocid="checkout.review_back_button"
        >
          Back
        </Button>
        <Button
          className="flex-[2] h-12 text-base font-semibold"
          onClick={onSubmit}
          disabled={isSubmitting}
          data-ocid="checkout.submit_button"
        >
          {isSubmitting ? (
            <span
              className="flex items-center gap-2"
              data-ocid="checkout.loading_state"
            >
              <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              Placing Order…
            </span>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-1.5" />
              Place Order
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ orderId }: { orderId: string }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center py-10"
      data-ocid="checkout.success_state"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Check className="w-9 h-9 text-primary" />
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">
        Order Placed!
      </h2>
      <p className="text-muted-foreground mb-1 max-w-sm">
        Thank you for your purchase. We'll send you a confirmation shortly.
      </p>
      <p className="text-xs text-muted-foreground mb-8">
        Order #{" "}
        <span className="font-mono font-semibold text-foreground">
          {orderId}
        </span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate({ to: "/orders" })}
          data-ocid="checkout.view_orders_button"
        >
          View Orders
        </Button>
        <Button
          className="flex-1"
          onClick={() => navigate({ to: "/catalog" })}
          data-ocid="checkout.continue_shopping_button"
        >
          Continue Shopping
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const [step, setStep] = useState<Step>(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0n : SHIPPING_COST;

  // If cart empty and no success, redirect
  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4" data-ocid="checkout.empty_state">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button
            onClick={() => navigate({ to: "/catalog" })}
            data-ocid="checkout.browse_button"
          >
            Browse Catalog
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      const result = await createOrder.mutateAsync({
        paymentIntent: `mock_pi_${Date.now()}`,
        shippingAddress: shippingForm,
      });
      // result may be an order object or id
      const id =
        typeof result === "object" && result !== null && "id" in result
          ? String((result as { id: bigint }).id)
          : String(Date.now());
      clearCart();
      setOrderId(id);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Checkout
            </h1>
            {!orderId && (
              <Badge variant="secondary">
                {items.length} {items.length === 1 ? "item" : "items"}
              </Badge>
            )}
          </div>
          {!orderId && <StepIndicator current={step} />}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {orderId ? (
          <Card className="p-8 shadow-elevated">
            <SuccessScreen orderId={orderId} />
          </Card>
        ) : (
          <Card
            className="p-6 sm:p-8 shadow-elevated"
            data-ocid="checkout.dialog"
          >
            <div className="mb-6">
              <h2 className="font-display text-lg font-bold text-foreground">
                {step === 1 && "Shipping Address"}
                {step === 2 && "Payment Details"}
                {step === 3 && "Review Your Order"}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {step === 1 && "Where should we deliver your order?"}
                {step === 2 &&
                  "Enter your card details to complete the purchase."}
                {step === 3 &&
                  "Check everything looks right before confirming."}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <ShippingStep
                  key="step1"
                  form={shippingForm}
                  onChange={setShippingForm}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <PaymentStep
                  key="step2"
                  form={paymentForm}
                  onChange={setPaymentForm}
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                />
              )}
              {step === 3 && (
                <ReviewStep
                  key="step3"
                  items={items}
                  shipping={shipping}
                  shippingForm={shippingForm}
                  onBack={() => setStep(2)}
                  onSubmit={handleSubmit}
                  isSubmitting={createOrder.isPending}
                />
              )}
            </AnimatePresence>
          </Card>
        )}
      </div>
    </div>
  );
}
