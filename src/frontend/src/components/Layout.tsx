import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useIsAdmin } from "../hooks/use-backend";
import { useCart } from "../hooks/use-cart";

const NAV_LINKS = [
  { label: "Shop All", to: "/catalog", category: undefined },
  { label: "Headphones", to: "/catalog", category: "Headphones" },
  { label: "Smartwatches", to: "/catalog", category: "Smartwatches" },
  { label: "Speakers", to: "/catalog", category: "Speakers" },
  { label: "Keyboards", to: "/catalog", category: "Keyboards" },
];

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 size-4.5 min-w-[1.125rem] flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold leading-none px-1">
      {count > 99 ? "99+" : count}
    </span>
  );
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, principal, login, logout, isLoading } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const principalStr = principal?.toText();
  const { data: isAdmin } = useIsAdmin(principalStr);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate({ to: "/catalog", search: { q: search.trim() } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 group"
              data-ocid="header.logo.link"
            >
              <div className="size-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
                <Package className="size-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-lg text-foreground leading-none">
                  Aurora
                </span>
                <span className="block text-[10px] font-medium text-muted-foreground tracking-widest uppercase leading-none">
                  Tech Store
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={`${link.to}-${link.category ?? "all"}`}
                  to={link.to}
                  search={link.category ? { category: link.category } : {}}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-md hidden sm:flex"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="pl-9 bg-background border-input"
                  data-ocid="header.search_input"
                />
              </div>
            </form>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Cart */}
              <Link
                to="/cart"
                data-ocid="header.cart.link"
                className="relative"
              >
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <ShoppingCart className="size-5" />
                  <CartBadge count={totalItems} />
                </Button>
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Account menu"
                      data-ocid="header.account.open_modal_button"
                    >
                      <User className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/account" data-ocid="header.account.link">
                        <User className="size-4 mr-2" /> My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" data-ocid="header.orders.link">
                        <Package className="size-4 mr-2" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" data-ocid="header.admin.link">
                            <LayoutDashboard className="size-4 mr-2" /> Admin
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive"
                      data-ocid="header.logout.button"
                    >
                      <LogOut className="size-4 mr-2" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isLoading}
                  data-ocid="header.login.button"
                  className="hidden sm:flex"
                >
                  {isLoading ? "Signing in…" : "Sign in"}
                </Button>
              )}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                data-ocid="header.mobile_menu.toggle"
              >
                {mobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="pb-3 sm:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="pl-9 bg-background border-input w-full"
                data-ocid="header.mobile_search_input"
              />
            </div>
          </form>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={`${link.to}-${link.category ?? "all"}`}
                to={link.to}
                search={link.category ? { category: link.category } : {}}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Button
                className="w-full mt-2"
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoading}
                data-ocid="header.mobile_login.button"
              >
                Sign in with Internet Identity
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Package className="size-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg text-foreground">
                  Aurora Tech
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium tech products curated for the modern professional.
                Quality guaranteed.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm mb-3">
                Shop
              </h4>
              <ul className="space-y-2">
                {["Headphones", "Smartwatches", "Speakers", "Keyboards"].map(
                  (cat) => (
                    <li key={cat}>
                      <Link
                        to="/catalog"
                        search={{ category: cat }}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {cat}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm mb-3">
                Account
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "My Orders", href: "/orders" },
                  { label: "Cart", href: "/cart" },
                  { label: "Checkout", href: "/checkout" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href as "/"}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm mb-3">
                Info
              </h4>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Support"].map(
                  (item) => (
                    <li key={item}>
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
