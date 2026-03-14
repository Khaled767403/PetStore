import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  PawPrint,
  Tag,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useState } from "react";

const sidebarItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: FolderTree },
  { label: "Animal Types", path: "/admin/animals", icon: PawPrint },
  { label: "Offers", path: "/admin/offers", icon: Tag },
  { label: "Orders", path: "/admin/orders", icon: ClipboardList },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 md:sticky md:top-0 flex h-screen w-64 flex-col bg-card border-r border-border transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <PawPrint className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold text-lg">PetStore Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          className="flex items-center gap-3 border-t border-border px-6 py-4 text-sm text-muted-foreground hover:text-sale transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-card px-6 py-3">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          <h2 className="font-heading font-semibold">
            {sidebarItems.find((i) => location.pathname.startsWith(i.path))?.label || "Admin"}
          </h2>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}