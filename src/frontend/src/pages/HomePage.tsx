import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Package, Shield, Truck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { SortOption } from "../backend";
import { CategoryBadge } from "../components/CategoryBadge";
import { ProductCard } from "../components/ProductCard";
import { useListProducts } from "../hooks/use-backend";
import { CATEGORIES } from "../types";

const FEATURES = [
  {
    icon: Zap,
    title: "Fast Shipping",
    desc: "Same-day dispatch on orders before 2 PM",
  },
  {
    icon: Shield,
    title: "2-Year Warranty",
    desc: "All products covered with extended protection",
  },
  {
    icon: Truck,
    title: "Free Returns",
    desc: "Hassle-free 30-day return policy",
  },
];

function ProductSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: productsPage, isLoading } = useListProducts({
    page: 0,
    pageSize: 8,
    sortBy: SortOption.bestSelling,
  });

  const products = productsPage?.items ?? [];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0 lg:min-h-[520px] flex flex-col lg:flex-row items-center gap-8">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 max-w-lg py-8 lg:py-16 z-10"
          >
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Zap className="size-3" />
              New arrivals every week
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-4">
              Discover the{" "}
              <span className="text-transparent bg-clip-text gradient-primary">
                Future
              </span>{" "}
              of Audio
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Premium tech products for the modern professional. Curated
              selection of headphones, smartwatches, speakers and more.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                size="lg"
                asChild
                className="gap-2 font-semibold"
                data-ocid="hero.shop_now.primary_button"
              >
                <Link to="/catalog">
                  Shop Now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                data-ocid="hero.view_deals.secondary_button"
              >
                <Link to="/catalog">View Deals</Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="flex-1 w-full lg:max-w-[640px] rounded-2xl overflow-hidden shadow-elevated"
          >
            <img
              src="/assets/generated/hero-tech-products.dim_1400x560.jpg"
              alt="Premium tech products"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Category quick filters */}
      <section className="bg-muted/30 border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-sm font-medium text-muted-foreground shrink-0">
              Browse:
            </span>
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat}
                to="/catalog"
                search={{ category: cat }}
                data-ocid={`home.category.tab.${i + 1}`}
              >
                <CategoryBadge
                  category={cat}
                  className="cursor-pointer hover:opacity-80 transition-smooth text-sm py-1.5 px-4"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="py-12 lg:py-16 bg-background"
        data-ocid="home.featured.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Best Sellers
              </h2>
              <p className="text-muted-foreground mt-1">
                Top-rated products our customers love
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="hidden sm:flex gap-2"
              data-ocid="home.view_all.secondary_button"
            >
              <Link to="/catalog">
                View All <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }, (_, i) => `skel-${i}`).map((k) => (
                <ProductSkeleton key={k} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              className="text-center py-20 rounded-xl bg-muted/40 border border-border"
              data-ocid="home.products.empty_state"
            >
              <Package className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display font-semibold text-foreground mb-2">
                Products coming soon
              </h3>
              <p className="text-muted-foreground text-sm">
                Check back shortly — our catalog is being stocked.
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              data-ocid="home.products.list"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id.toString()}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 lg:py-16 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border shadow-subtle"
              >
                <div className="size-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <feature.icon className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
