import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAdminProducts, deleteProduct } from "@/services/admin/products";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export default function AdminProducts() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["admin-products", search],
    queryFn: () => getAdminProducts({ q: search }),
  });

  const products = data?.items || [];

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Archive this product?");
    if (!ok) return;

    try {
      await deleteProduct(id);
      await refetch();
    } catch (error) {
      console.error("Failed to archive product", error);
      alert("Failed to archive product");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-sale">Failed to load products.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Product
              </th>

              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Price
              </th>

              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Stock
              </th>

              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product: any) => (
              <tr
                key={product.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.mainImageUrl || ""}
                      alt={product.title}
                      className="h-10 w-10 rounded-md object-cover bg-muted"
                    />

                    <span className="font-medium line-clamp-1">
                      {product.title}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {product.finalPrice} EGP
                </td>

                <td className="px-4 py-3">
                  {product.quantityOnHand}
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                      className="rounded-md p-1.5 hover:bg-muted transition-colors"
                    >
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded-md p-1.5 hover:bg-sale/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-sale" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}