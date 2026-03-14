import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/store/ProductCard";
import { api } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";

import heroBanner from "@/assets/hero-banner.jpg";
import defaultAnimalImage from "@/assets/pets/defult image.png";

type Product = {
  id: number;
  title: string;
  originalPrice: number;
  finalPrice: number;
  discountPercent: number;
  quantityOnHand: number;
  status: number;
  ratingAvg: number;
  ratingCount: number;
  mainImageUrl: string | null;
  offerSource?: string;
};

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

type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Index() {
  const [trees, setTrees] = useState<CatalogTreesResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingTrees, setLoadingTrees] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadTrees = async () => {
      try {
        setLoadingTrees(true);
        const res = await api.get<CatalogTreesResponse>("/trees");
        setTrees(res.data);
      } catch (error) {
        console.error("Failed to load trees", error);
        setTrees({ animals: [], productTypes: [] });
      } finally {
        setLoadingTrees(false);
      }
    };

    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await api.get<PagedResult<Product>>("/products", {
          params: { page: 1, pageSize: 18 },
        });
        setProducts(res.data?.items ?? []);
      } catch (error) {
        console.error("Failed to load products", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadTrees();
    loadProducts();
  }, []);

  const animals = trees?.animals ?? [];
  const productTypes = trees?.productTypes ?? [];

  const newArrivals = useMemo(() => products.slice(0, 6), [products]);

  const hotDeals = useMemo(
    () => products.filter((p) => Number(p.discountPercent) > 0).slice(0, 6),
    [products]
  );

  const featuredAnimals = useMemo(() => animals.slice(0, 2), [animals]);

  const getAnimalBannerImage = (animal?: AnimalTreeDto) => {
    if (!animal?.imageUrl) return defaultAnimalImage;
    return resolveMediaUrl(animal.imageUrl) || defaultAnimalImage;
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[300px] md:h-[420px]">
          <img
            src={heroBanner}
            alt="PetStore - Everything for your pet"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-primary/80 to-primary/30">
            <div className="container mx-auto px-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.6 }}
              >
                <h1 className="mb-3 text-3xl font-heading font-bold text-primary-foreground md:text-5xl">
                  Everything Your Pet
                  <br />
                  Needs & Loves
                </h1>
                <p className="mb-6 max-w-md text-primary-foreground/80">
                  Premium food, toys, and accessories for all your furry,
                  feathered, and finned friends.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-heading font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Pet */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-heading font-bold">
          Shop by Pet
        </h2>

        {loadingTrees ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading pets...
          </div>
        ) : animals.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No animal types found yet.
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {animals.map((animal, i) => {
              const imageSrc = animal.imageUrl
                ? resolveMediaUrl(animal.imageUrl)
                : defaultAnimalImage;

              return (
                <motion.div
                  key={animal.id}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/products?animalTypeId=${animal.id}`}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-primary/20 transition-colors group-hover:border-accent md:h-28 md:w-28">
                      <img
                        src={imageSrc || defaultAnimalImage}
                        alt={animal.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-heading font-semibold text-foreground transition-colors group-hover:text-primary">
                      {animal.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold">New Arrivals</h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading products...
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No products found yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Pet Categories */}
      {featuredAnimals.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {featuredAnimals.map((animal) => (
              <Link
                key={animal.id}
                to={`/products?animalTypeId=${animal.id}`}
                className="group relative h-56 overflow-hidden rounded-xl"
              >
                <img
                  src={getAnimalBannerImage(animal)}
                  alt={animal.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-2xl font-heading font-bold text-primary-foreground">
                    {animal.name} Essentials
                  </h3>
                  <p className="mt-1 text-sm text-primary-foreground/85">
                    Explore top products picked for {animal.name.toLowerCase()} lovers.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Hot Deals */}
      {hotDeals.length > 0 && (
        <section className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold">🔥 Hot Deals</h2>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {hotDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-heading font-bold">
          Shop by Category
        </h2>

        {loadingTrees ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading categories...
          </div>
        ) : productTypes.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No product type categories found yet.
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {productTypes.map((type) => (
              <Link
                key={type.id}
                to={`/products?productTypeCategoryId=${type.id}`}
                className="rounded-full border-2 border-primary/20 px-6 py-3 font-heading font-medium text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {type.name}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}