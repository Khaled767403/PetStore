import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE =
  "https://via.placeholder.com/400x400?text=Pet+Product";

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const imageUrl = resolveMediaUrl(product.mainImageUrl) || FALLBACK_IMAGE;
  const isOutOfStock = product.quantityOnHand <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      quantity: 1,
      price: product.finalPrice,
      title: product.title,
      image: imageUrl,
    });
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {product.discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-sale px-2.5 py-1 text-xs font-bold text-sale-foreground">
            -{product.discountPercent}%
          </span>
        )}

        {isOutOfStock && (
          <span className="absolute right-2 top-2 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {product.title}
        </h3>

        <div className="mb-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs text-muted-foreground">
            {product.ratingAvg} ({product.ratingCount})
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-primary">
                {product.finalPrice} EGP
              </span>

              {product.discountPercent > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  {product.originalPrice} EGP
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}