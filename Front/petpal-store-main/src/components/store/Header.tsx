import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { api } from "@/lib/api";
import logo from "@/assets/logo.png";

type TreeNodeDto = {
  id: number;
  name: string;
  slug: string;
  children: TreeNodeDto[];
};

type AnimalTreeDto = {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  categories: TreeNodeDto[];
};

type CatalogTreesResponse = {
  animals: AnimalTreeDto[];
  productTypes: TreeNodeDto[];
};

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trees, setTrees] = useState<CatalogTreesResponse | null>(null);

  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => {
    const loadTrees = async () => {
      try {
        const res = await api.get<CatalogTreesResponse>("/trees");
        setTrees(res.data);
      } catch (error) {
        console.error("Failed to load header trees", error);
        setTrees({ animals: [], productTypes: [] });
      }
    };

    loadTrees();
  }, []);

  const navItems = useMemo(() => {
    const animalLinks =
      trees?.animals?.slice(0, 5).map((animal) => ({
        label: animal.name,
        path: `/products?animalTypeId=${animal.id}`,
      })) ?? [];

    const featuredCategory =
      trees?.productTypes?.find((x) =>
        `${x.name} ${x.slug}`.toLowerCase().includes("pharmacy")
      ) || trees?.productTypes?.[0];

    return [
      { label: "Home", path: "/" },
      ...animalLinks,
      ...(featuredCategory
        ? [
            {
              label: featuredCategory.name,
              path: `/products?productTypeCategoryId=${featuredCategory.id}`,
            },
          ]
        : []),
      { label: "All Products", path: "/products" },
    ];
  }, [trees]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="PetStore"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden max-w-xl flex-1 md:flex">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-background py-2.5 pl-5 pr-12 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-3">

          <Link
            to="/admin/login"
            className="hidden items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />

            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <form onSubmit={handleSearch} className="px-4 pb-3 md:hidden">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-background py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-primary p-1.5 text-primary-foreground"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Desktop Nav */}
      <nav className="hidden border-t border-border bg-primary md:block">
        <div className="container mx-auto flex items-center gap-1 px-4">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.path}`}
              to={item.path}
              className="rounded-md px-4 py-2.5 text-sm font-medium text-primary-foreground/90 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="animate-slide-in border-t border-border bg-card md:hidden">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.path}-mobile`}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/admin/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block border-b border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Admin Login
          </Link>
        </nav>
      )}
    </header>
  );
}