import { b as useAuth, j as jsxRuntimeExports, S as Skeleton, U as User, B as Button, m as motion, e as LogOut, g as useGetWishlist, h as useRemoveFromWishlist, L as Link, i as useGetProduct, k as ProductCard, l as ue } from "./index-DZsoK5NI.js";
import { S as Separator } from "./separator-tSHo2qEV.js";
import { H as Heart } from "./heart-sadvECVP.js";
import { S as ShoppingBag } from "./shopping-bag-CKfzG8ah.js";
import "./index-CrEIOzH3.js";
function WishlistItem({
  productId,
  index,
  onRemove
}) {
  const { data: product, isLoading } = useGetProduct(productId);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] rounded-xl" });
  }
  if (!product) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { duration: 0.25, delay: index * 0.06 },
      className: "relative group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product, index }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onRemove(productId),
            type: "button",
            "aria-label": "Remove from wishlist",
            "data-ocid": `account.wishlist.remove_button.${index + 1}`,
            className: "absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive hover:text-destructive-foreground hover:border-destructive",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-3.5 fill-current" })
          }
        )
      ]
    }
  );
}
function WishlistSection() {
  const { data: wishlist, isLoading } = useGetWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const handleRemove = (productId) => {
    removeFromWishlist.mutate(productId, {
      onSuccess: () => ue.success("Removed from wishlist"),
      onError: () => ue.error("Could not remove item")
    });
  };
  const productIds = (wishlist == null ? void 0 : wishlist.productIds) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-5 text-chart-5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Wishlist" }),
      productIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold bg-chart-5/10 text-chart-5 border border-chart-5/20 px-2 py-0.5 rounded-full", children: productIds.length })
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "account.wishlist.loading_state",
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
        children: Array.from({ length: 3 }, (_, i) => `wskel-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] rounded-xl" }, k))
      }
    ),
    !isLoading && productIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "account.wishlist.list",
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
        children: productIds.map((id, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          WishlistItem,
          {
            productId: id,
            index: i,
            onRemove: handleRemove
          },
          id.toString()
        ))
      }
    ),
    !isLoading && productIds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        "data-ocid": "account.wishlist.empty_state",
        className: "flex flex-col items-center gap-5 py-14 px-8 text-center rounded-xl border border-dashed border-border bg-muted/30",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-chart-5/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-6 text-chart-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "Your wishlist is empty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Save products you love by tapping the heart icon on any product page." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              asChild: true,
              "data-ocid": "account.wishlist.browse_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/catalog", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "size-4 mr-2" }),
                "Browse Products"
              ] })
            }
          )
        ]
      }
    )
  ] });
}
function ProfileSection() {
  const { principal, logout } = useAuth();
  const principalText = (principal == null ? void 0 : principal.toText()) ?? "";
  const truncated = principalText.length > 20 ? `${principalText.slice(0, 10)}…${principalText.slice(-8)}` : principalText;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.section,
    {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35 },
      className: "rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-base leading-tight", children: "My Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-muted-foreground font-mono mt-0.5 truncate",
                title: principalText,
                "data-ocid": "account.principal_id",
                children: truncated
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: logout,
            className: "shrink-0 gap-2",
            "data-ocid": "account.logout_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-3.5" }),
              "Sign Out"
            ]
          }
        )
      ]
    }
  );
}
function LoginPrompt({ onLogin }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "account.login_prompt",
      className: "flex flex-col items-center justify-center gap-6 min-h-[60vh] px-8 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-9 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Sign in to your account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm", children: "View your profile and wishlist by signing in with Internet Identity." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onLogin, "data-ocid": "account.login_button", children: "Sign In" })
      ]
    }
  );
}
function AccountPage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  if (!authLoading && !isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPrompt, { onLogin: login });
  }
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "account.loading_state",
        className: "max-w-4xl mx-auto w-full px-4 sm:px-6 py-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl mb-8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-32 mb-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: Array.from({ length: 3 }, (_, i) => `askel-${i}`).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] rounded-xl" }, k)) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "account.page",
      className: "max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground", children: "Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5 text-sm", children: "Manage your profile and saved items" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSection, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(WishlistSection, {})
      ]
    }
  );
}
export {
  AccountPage as default
};
