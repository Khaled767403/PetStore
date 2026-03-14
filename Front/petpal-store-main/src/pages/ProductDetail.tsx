import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { ProductCard } from "@/components/store/ProductCard";
import { useProduct } from "@/hooks/public/useProduct";
import { useRelatedProducts } from "@/hooks/public/useRelatedProducts";
import { resolveMediaUrl } from "@/lib/media";
import { rateProduct } from "@/services/public/products";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/800x800?text=Pet+Product";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);

  const [quantity, setQuantity] = useState(1);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");
  const [localRatingAvg, setLocalRatingAvg] = useState<number | null>(null);
  const [localRatingCount, setLocalRatingCount] = useState<number | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  const { data: product, isLoading } = useProduct(productId);
  const { data: related } = useRelatedProducts(productId);

  const displayImage = useMemo(() => {
    if (!product) return FALLBACK_IMAGE;

    const firstGalleryImage =
      product.imageUrls && product.imageUrls.length > 0
        ? product.imageUrls[0]
        : null;

    return (
      resolveMediaUrl(firstGalleryImage || product.mainImageUrl) || FALLBACK_IMAGE
    );
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Product not found</p>
        <Link
          to="/products"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.quantityOnHand <= 0;

  const effectiveRatingAvg =
    localRatingAvg !== null ? localRatingAvg : product.ratingAvg;
  const effectiveRatingCount =
    localRatingCount !== null ? localRatingCount : product.ratingCount;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      quantity,
      price: product.finalPrice,
      title: product.title,
      image: displayImage,
    });
  };

  const handleRate = async () => {
    if (!selectedRating) {
      setRatingMessage("Please choose a star rating first.");
      return;
    }

    try {
      setSubmittingRating(true);
      setRatingMessage("");

      await rateProduct(product.id, selectedRating);

      const currentAvg = effectiveRatingAvg || 0;
      const currentCount = effectiveRatingCount || 0;

      const newCount = currentCount + 1;
      const newAvg = (currentAvg * currentCount + selectedRating) / newCount;

      setLocalRatingCount(newCount);
      setLocalRatingAvg(Number(newAvg.toFixed(1)));
      setRatingMessage("Thanks! Your rating has been submitted.");
      setSelectedRating(0);
    } catch (error: any) {
  console.error("Failed to rate product", error);
  const message =
    error?.response?.data?.message || "Failed to submit rating. Please try again.";
  setRatingMessage(message);
}
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={displayImage}
            alt={product.title}
            className="h-full w-full object-cover"
          />

          {product.discountPercent > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-sale px-3 py-1.5 text-sm font-bold text-sale-foreground">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="mb-3 text-2xl font-heading font-bold md:text-3xl">
            {product.title}
          </h1>

          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(effectiveRatingAvg)
                      ? "fill-accent text-accent"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>

            <span className="text-sm text-muted-foreground">
              ({effectiveRatingCount} reviews)
            </span>
          </div>

          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {product.finalPrice} EGP
            </span>

            {product.discountPercent > 0 && (
              <span className="text-lg text-muted-foreground line-through">
                {product.originalPrice} EGP
              </span>
            )}
          </div>

          <p className="mb-6 leading-relaxed text-muted-foreground">
            {product.description ||
              "Premium quality product for your beloved pet."}
          </p>

          {/* Rating box */}
          <div className="mb-6 rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 font-heading font-semibold">Rate this product</h3>

            <div className="mb-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= selectedRating
                        ? "fill-accent text-accent"
                        : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRate}
                disabled={submittingRating}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {submittingRating ? "Submitting..." : "Submit Rating"}
              </button>

              {ratingMessage && (
                <span className="text-sm text-muted-foreground">
                  {ratingMessage}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 transition-colors hover:bg-muted"
                disabled={isOutOfStock}
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="px-4 font-medium">{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2.5 transition-colors hover:bg-muted"
                disabled={isOutOfStock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-heading font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            {isOutOfStock ? (
              <p>❌ Currently out of stock</p>
            ) : (
              <p>✅ In Stock ({product.quantityOnHand} available)</p>
            )}
            <p className="mt-1">🚚 Free delivery on orders over 500 EGP</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <section>
          <h2 className="mb-6 text-xl font-heading font-bold">
            Related Products
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}