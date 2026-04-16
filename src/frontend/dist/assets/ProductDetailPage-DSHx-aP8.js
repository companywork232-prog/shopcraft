import { c as createLucideIcon, x as useParams, i as useGetProduct, r as reactExports, u as useCart, y as useAddToCart, z as useAddToWishlist, A as useListProducts, j as jsxRuntimeExports, B as Button, L as Link, C as CategoryBadge, f as formatPrice, D as ShoppingCart, k as ProductCard, l as ue, S as Skeleton, o as cn } from "./index-DZsoK5NI.js";
import { B as Badge } from "./badge-D0lfTSVp.js";
import { A as ArrowLeft } from "./arrow-left-BPQqcUFk.js";
import { M as Minus } from "./minus-C8UZ6_76.js";
import { P as Plus } from "./plus-DQJ_UeoP.js";
import { H as Heart } from "./heart-sadvECVP.js";
import { C as ChevronLeft } from "./chevron-left-BkRmXczA.js";
import { C as ChevronRight } from "./chevron-right-CuSwHgft.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
function DetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32 mb-8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] w-full rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-20 h-16 rounded-lg" }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-11 flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-11 w-11" })
        ] })
      ] })
    ] })
  ] });
}
function ImageGallery({ images, title }) {
  const [active, setActive] = reactExports.useState(0);
  const safeImages = images.length > 0 ? images : ["/assets/images/placeholder.svg"];
  const prev = () => setActive((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setActive((i) => (i + 1) % safeImages.length);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/3] bg-muted/40 rounded-xl overflow-hidden border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: safeImages[active],
          alt: `${title} – view ${active + 1}`,
          className: "w-full h-full object-cover"
        }
      ),
      safeImages.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: prev,
            "data-ocid": "product.gallery_prev",
            "aria-label": "Previous image",
            className: "absolute left-3 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card border border-border rounded-full p-1.5 shadow-subtle transition-smooth",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: next,
            "data-ocid": "product.gallery_next",
            "aria-label": "Next image",
            className: "absolute right-3 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card border border-border rounded-full p-1.5 shadow-subtle transition-smooth",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" })
          }
        )
      ] })
    ] }),
    safeImages.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: safeImages.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setActive(i),
        "data-ocid": `product.thumbnail.${i + 1}`,
        className: cn(
          "w-20 h-16 rounded-lg overflow-hidden border-2 transition-smooth shrink-0",
          active === i ? "border-primary" : "border-border hover:border-foreground/30"
        ),
        "aria-label": `View ${i + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src,
            alt: `${title} view ${i + 1}`,
            className: "w-full h-full object-cover"
          }
        )
      },
      src
    )) })
  ] });
}
function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const productId = BigInt(id ?? "0");
  const { data: productResult, isLoading } = useGetProduct(productId);
  const product = Array.isArray(productResult) ? productResult[0] ?? null : productResult ?? null;
  const [quantity, setQuantity] = reactExports.useState(1);
  const { addItem, isInCart } = useCart();
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const { data: relatedResult } = useListProducts({
    category: product == null ? void 0 : product.category,
    pageSize: 4,
    page: 0
  });
  const relatedProducts = ((relatedResult == null ? void 0 : relatedResult.items) ?? []).filter((p) => p.id !== (product == null ? void 0 : product.id)).slice(0, 4);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(DetailSkeleton, {});
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "product.error_state",
        className: "flex flex-col items-center justify-center gap-4 min-h-[60vh] text-center px-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-12 text-destructive/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Product not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "This product may have been removed or the link is incorrect." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", "data-ocid": "product.back_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/catalog", children: "Browse Catalog" }) })
        ]
      }
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
      image: product.images[0] ?? ""
    });
    for (let i = 1; i < quantity; i++) {
      addItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] ?? ""
      });
    }
    ue.success(`${product.title} added to cart`);
  };
  const handleAddToWishlist = () => {
    addToWishlistMutation.mutate(product.id, {
      onSuccess: () => ue.success("Added to wishlist"),
      onError: () => ue.error("Sign in to save to wishlist")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: "flex items-center gap-2 text-sm text-muted-foreground",
        "aria-label": "Breadcrumb",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/catalog",
              "data-ocid": "product.back_link",
              className: "flex items-center gap-1 hover:text-foreground transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
                "Catalog"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium truncate max-w-xs", children: product.title })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImageGallery, { images: product.images, title: product.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { category: product.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h1",
            {
              "data-ocid": "product.title",
              className: "font-display text-3xl font-bold text-foreground leading-tight",
              children: product.title
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-baseline gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "data-ocid": "product.price",
            className: "font-display text-4xl font-bold text-foreground",
            children: formatPrice(product.price)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: inStock ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-accent shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              "data-ocid": "product.inventory_status",
              className: "text-sm font-medium text-accent",
              children: [
                "In Stock",
                product.inventoryCount <= 5n && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
                  " ",
                  "— only ",
                  product.inventoryCount.toString(),
                  " left"
                ] })
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 text-destructive shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "data-ocid": "product.inventory_status",
              className: "text-sm font-medium text-destructive",
              children: "Out of Stock"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed", children: product.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
          "🛒 ",
          Number(product.soldCount),
          " sold"
        ] }) }),
        inStock && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Quantity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 border border-border rounded-lg overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setQuantity((q) => Math.max(1, q - 1)),
                  disabled: quantity <= 1,
                  "data-ocid": "product.qty_minus",
                  className: "p-2 hover:bg-muted transition-colors disabled:opacity-40",
                  "aria-label": "Decrease quantity",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "size-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  "data-ocid": "product.qty_value",
                  className: "w-10 text-center font-semibold text-sm",
                  children: quantity
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setQuantity((q) => Math.min(maxQty, q + 1)),
                  disabled: quantity >= maxQty,
                  "data-ocid": "product.qty_plus",
                  className: "p-2 hover:bg-muted transition-colors disabled:opacity-40",
                  "aria-label": "Increase quantity",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "flex-1 gap-2",
                variant: inCart ? "secondary" : "default",
                onClick: handleAddToCart,
                disabled: addToCartMutation.isPending,
                "data-ocid": "product.add_to_cart_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "size-4" }),
                  inCart ? "Add More" : "Add to Cart"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "lg",
                variant: "outline",
                className: "gap-2",
                onClick: handleAddToWishlist,
                disabled: addToWishlistMutation.isPending,
                "data-ocid": "product.wishlist_button",
                "aria-label": "Add to wishlist",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "size-4" })
              }
            )
          ] }),
          inCart && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cart", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "w-full",
              "data-ocid": "product.view_cart_link",
              children: "View Cart"
            }
          ) })
        ] }),
        !inStock && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "lg",
            variant: "outline",
            disabled: true,
            "data-ocid": "product.out_of_stock_button",
            className: "opacity-60",
            children: "Out of Stock"
          }
        )
      ] })
    ] }) }),
    relatedProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 border-t border-border py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          "data-ocid": "product.related_section",
          className: "font-display text-2xl font-bold text-foreground mb-6",
          children: "Related Products"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5", children: relatedProducts.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, index: idx }, p.id.toString())) })
    ] }) })
  ] });
}
export {
  ProductDetailPage as default
};
