import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SortOption as BackendSortOption } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { useListProducts, useSearchProducts } from "../hooks/use-backend";
import { CATEGORIES } from "../types";

const SORT_OPTIONS: { label: string; value: BackendSortOption }[] = [
  { label: "Newest", value: BackendSortOption.newest },
  { label: "Best Selling", value: BackendSortOption.bestSelling },
  { label: "Price: Low to High", value: BackendSortOption.priceAsc },
  { label: "Price: High to Low", value: BackendSortOption.priceDesc },
];

const PAGE_SIZE = 12;
const MAX_PRICE_CENTS = 100_000; // $1000

function ProductSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between mt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function FilterSidebar({
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onReset,
}: {
  category: string | undefined;
  onCategoryChange: (c: string | undefined) => void;
  priceRange: [number, number];
  onPriceRangeChange: (r: [number, number]) => void;
  onReset: () => void;
}) {
  const formatPriceLabel = (cents: number) =>
    cents >= MAX_PRICE_CENTS ? "$1000+" : `$${(cents / 100).toFixed(0)}`;

  return (
    <aside className="w-60 shrink-0 flex flex-col gap-6">
      {/* Category */}
      <div>
        <p className="font-display font-semibold text-sm text-foreground mb-3">
          Category
        </p>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            data-ocid="catalog.category.all"
            onClick={() => onCategoryChange(undefined)}
            className={cn(
              "text-left px-3 py-2 rounded-lg text-sm transition-smooth",
              !category
                ? "bg-primary text-primary-foreground font-medium"
                : "hover:bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              data-ocid={`catalog.category.${cat.toLowerCase()}`}
              onClick={() =>
                onCategoryChange(cat === category ? undefined : cat)
              }
              className={cn(
                "text-left px-3 py-2 rounded-lg text-sm transition-smooth",
                category === cat
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="font-display font-semibold text-sm text-foreground mb-3">
          Price Range
        </p>
        <div className="px-1">
          <Slider
            min={0}
            max={MAX_PRICE_CENTS}
            step={500}
            value={priceRange}
            onValueChange={(v) => onPriceRangeChange(v as [number, number])}
            data-ocid="catalog.price_range"
            className="mb-3"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPriceLabel(priceRange[0])}</span>
            <span>{formatPriceLabel(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        data-ocid="catalog.reset_filters_button"
        className="w-full"
      >
        <X className="size-3.5 mr-1.5" />
        Reset Filters
      </Button>
    </aside>
  );
}

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<BackendSortOption>(
    BackendSortOption.newest,
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    MAX_PRICE_CENTS,
  ]);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Reset page when any filter/search changes
  const filterKey = `${debouncedSearch}|${category ?? ""}|${sortBy}|${priceRange[0]}-${priceRange[1]}`;
  const prevFilterKey = useRef(filterKey);
  if (prevFilterKey.current !== filterKey) {
    prevFilterKey.current = filterKey;
    setPage(0);
  }

  const isSearching = debouncedSearch.trim().length > 0;

  const listResult = useListProducts({
    page,
    pageSize: PAGE_SIZE,
    category,
    sortBy,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < MAX_PRICE_CENTS ? priceRange[1] : undefined,
    search: isSearching ? debouncedSearch : undefined,
  });

  const searchResult = useSearchProducts(debouncedSearch, page, PAGE_SIZE);

  const activeResult = isSearching ? searchResult : listResult;
  const items = activeResult.data?.items ?? [];
  const total = Number(activeResult.data?.total ?? 0n);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isLoading = activeResult.isLoading;

  const resetFilters = () => {
    setCategory(undefined);
    setSortBy(BackendSortOption.newest);
    setPriceRange([0, MAX_PRICE_CENTS]);
    setSearch("");
    setDebouncedSearch("");
    setPage(0);
  };

  const activeFilterCount = [
    category !== undefined,
    priceRange[0] > 0 || priceRange[1] < MAX_PRICE_CENTS,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Shop All Products
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLoading ? "Loading..." : `${total} products available`}
          </p>

          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="catalog.search_input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDebouncedSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as BackendSortOption)}
              >
                <SelectTrigger
                  data-ocid="catalog.sort_select"
                  className="w-48 bg-card"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      data-ocid={`catalog.sort.${opt.value}`}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                className="lg:hidden gap-2"
                onClick={() => setShowFilters((s) => !s)}
                data-ocid="catalog.filters_toggle"
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Category tab bar (desktop) */}
          <div className="hidden lg:flex gap-2 mt-4 flex-wrap">
            <button
              type="button"
              data-ocid="catalog.tab.all"
              onClick={() => setCategory(undefined)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-smooth border",
                !category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20",
              )}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid={`catalog.tab.${cat.toLowerCase()}`}
                onClick={() => setCategory(cat === category ? undefined : cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-smooth border",
                  category === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar (desktop) */}
          <div className="hidden lg:block">
            <FilterSidebar
              category={category}
              onCategoryChange={setCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onReset={resetFilters}
            />
          </div>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="absolute inset-0 bg-foreground/40"
                role="button"
                tabIndex={0}
                aria-label="Close filters"
                onClick={() => setShowFilters(false)}
                onKeyUp={(e) => e.key === "Enter" && setShowFilters(false)}
              />
              <div className="relative ml-auto w-72 bg-card h-full shadow-elevated p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-semibold text-foreground">
                    Filters
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                    data-ocid="catalog.filters_close"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <FilterSidebar
                  category={category}
                  onCategoryChange={(c) => {
                    setCategory(c);
                    setShowFilters(false);
                  }}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  onReset={() => {
                    resetFilters();
                    setShowFilters(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: PAGE_SIZE }, (_, i) => `skel-${i}`).map(
                  (k) => (
                    <ProductSkeleton key={k} />
                  ),
                )}
              </div>
            ) : items.length === 0 ? (
              <div
                data-ocid="catalog.empty_state"
                className="flex flex-col items-center justify-center gap-4 py-24 text-center"
              >
                <div className="text-5xl">🔍</div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  No products found
                </h2>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Try adjusting your filters or search term to find what you're
                  looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  data-ocid="catalog.empty_reset_button"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {items.map((product, idx) => (
                    <ProductCard
                      key={product.id.toString()}
                      product={product}
                      index={idx}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      data-ocid="catalog.pagination_prev"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i)
                      .filter((i) => Math.abs(i - page) <= 2)
                      .map((i) => (
                        <Button
                          key={i}
                          variant={i === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(i)}
                          data-ocid={`catalog.page.${i + 1}`}
                          className="min-w-[2.25rem]"
                        >
                          {i + 1}
                        </Button>
                      ))}

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page >= totalPages - 1}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      data-ocid="catalog.pagination_next"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
