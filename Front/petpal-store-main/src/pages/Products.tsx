import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/store/ProductCard";
import { SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/public/useProducts";

export default function Products() {
  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") || undefined;
  const animalTypeId = searchParams.get("animalTypeId");
  const animalCategoryId = searchParams.get("animalCategoryId");
  const productTypeCategoryId = searchParams.get("productTypeCategoryId");

  const { data, isLoading, isError } = useProducts({
    q,
    animalTypeId: animalTypeId ? Number(animalTypeId) : undefined,
    animalCategoryId: animalCategoryId ? Number(animalCategoryId) : undefined,
    productTypeCategoryId: productTypeCategoryId
      ? Number(productTypeCategoryId)
      : undefined,
    page: 1,
    pageSize: 40,
  });

  const products = data?.items ?? [];

  const pageTitle = q
    ? `Search: "${q}"`
    : "Products";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-sale">Failed to load products</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">{pageTitle}</h1>

        <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}