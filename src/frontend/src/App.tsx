import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./hooks/use-auth";
import { useAuth } from "./hooks/use-auth";
import { Role } from "./types";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const ContactDetailPage = lazy(() => import("./pages/ContactDetailPage"));
const DealsPage = lazy(() => import("./pages/DealsPage"));
const ActivitiesPage = lazy(() => import("./pages/ActivitiesPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const PurchaseOrdersPage = lazy(() => import("./pages/PurchaseOrdersPage"));
const InvoicesPage = lazy(() => import("./pages/InvoicesPage"));
const FinancialsPage = lazy(() => import("./pages/FinancialsPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

function PageFallback() {
  return (
    <div className="p-8 space-y-4 max-w-5xl mx-auto">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {Array.from({ length: 4 }, (_, i) => `kpi-${i}`).map((k) => (
          <Skeleton key={k} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl mt-4" />
    </div>
  );
}

// ─── RBAC Guards ─────────────────────────────────────────────────────────────

const ADMIN_ROLES: Role[] = [Role.admin];
const ERP_ROLES: Role[] = [Role.admin, Role.manager, Role.finance];
const CRM_ROLES: Role[] = [Role.admin, Role.manager, Role.sales_rep];

function RoleGuard({
  allowed,
  children,
}: {
  allowed: Role[];
  children: React.ReactNode;
}) {
  const { role, isRoleLoading, isAuthenticated } = useAuth();

  // While loading, show skeleton to avoid flash redirect
  if (isRoleLoading) return <PageFallback />;

  // Not authenticated: redirect to dashboard (will prompt login)
  if (!isAuthenticated) return <Navigate to="/dashboard" />;

  // No role assigned yet — let through; backend will enforce
  if (role === null || role === undefined) return <>{children}</>;

  // Role not in allowed list → redirect to dashboard
  if (!allowed.includes(role)) return <Navigate to="/dashboard" />;

  return <>{children}</>;
}

// ─── Root Route ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </Layout>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  ),
});

// ─── Dashboard routes (public) ────────────────────────────────────────────────

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <DashboardPage />,
});

const dashboardAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => <DashboardPage />,
});

// ─── CRM routes (admin | manager | sales_rep) ─────────────────────────────────

const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/crm/contacts",
  component: () => (
    <RoleGuard allowed={CRM_ROLES}>
      <ContactsPage />
    </RoleGuard>
  ),
});

const contactDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/crm/contacts/$id",
  component: () => (
    <RoleGuard allowed={CRM_ROLES}>
      <ContactDetailPage />
    </RoleGuard>
  ),
});

const dealsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/crm/deals",
  component: () => (
    <RoleGuard allowed={CRM_ROLES}>
      <DealsPage />
    </RoleGuard>
  ),
});

const activitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/crm/activities",
  component: () => (
    <RoleGuard allowed={CRM_ROLES}>
      <ActivitiesPage />
    </RoleGuard>
  ),
});

// ─── ERP routes (admin | manager | finance) ───────────────────────────────────

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/erp/products",
  component: () => (
    <RoleGuard allowed={ERP_ROLES}>
      <ProductsPage />
    </RoleGuard>
  ),
});

const purchaseOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/erp/purchase-orders",
  component: () => (
    <RoleGuard allowed={ERP_ROLES}>
      <PurchaseOrdersPage />
    </RoleGuard>
  ),
});

const invoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/erp/invoices",
  component: () => (
    <RoleGuard allowed={ERP_ROLES}>
      <InvoicesPage />
    </RoleGuard>
  ),
});

const financialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/erp/financials",
  component: () => (
    <RoleGuard allowed={ERP_ROLES}>
      <FinancialsPage />
    </RoleGuard>
  ),
});

// ─── Admin routes (admin only) ────────────────────────────────────────────────

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <RoleGuard allowed={ADMIN_ROLES}>
      <AdminPage />
    </RoleGuard>
  ),
});

// ─── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  dashboardAliasRoute,
  contactsRoute,
  contactDetailRoute,
  dealsRoute,
  activitiesRoute,
  productsRoute,
  purchaseOrdersRoute,
  invoicesRoute,
  financialsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
