import { useEffect, useMemo, useState } from "react";
import { uploadImage } from "@/services/admin/uploads";
import { getAnimalTypes, getAnimalCategories, getProductTypeCategories } from "@/services/admin/catalog";
import { resolveMediaUrl } from "@/lib/media";

type AdminAnimalTypeDto = {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
};

type AdminAnimalCategoryDto = {
  id: number;
  animalTypeId: number;
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

type AdminProductTypeCategoryDto = {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

type ProductFormData = {
  title: string;
  description: string;
  price: number;
  discountPercent: number;
  quantityOnHand: number;
  status: number;
  imageUrls: string[];
  animalTypeIds: number[];
  animalCategoryIds: number[];
  productTypeCategoryIds: number[];
};

export default function AdminProductForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
}) {
  const [product, setProduct] = useState<ProductFormData>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    discountPercent: initialData?.discountPercent ?? 0,
    quantityOnHand: initialData?.quantityOnHand ?? 0,
    status: initialData?.status ?? 1,
    imageUrls: initialData?.imageUrls ?? [],
    animalTypeIds: initialData?.animalTypeIds ?? [],
    animalCategoryIds: initialData?.animalCategoryIds ?? [],
    productTypeCategoryIds: initialData?.productTypeCategoryIds ?? [],
  });

  const [animalTypes, setAnimalTypes] = useState<AdminAnimalTypeDto[]>([]);
  const [animalCategories, setAnimalCategories] = useState<AdminAnimalCategoryDto[]>([]);
  const [productTypeCategories, setProductTypeCategories] = useState<AdminProductTypeCategoryDto[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [typesRes, categoriesRes, productTypesRes] = await Promise.all([
          getAnimalTypes(),
          getAnimalCategories(),
          getProductTypeCategories(),
        ]);

        setAnimalTypes(typesRes || []);
        setAnimalCategories(categoriesRes || []);
        setProductTypeCategories(productTypesRes || []);
      } catch (error) {
        console.error("Failed to load product form options", error);
      }
    };

    loadOptions();
  }, []);

  const filteredAnimalCategories = useMemo(() => {
    if (!product.animalTypeIds.length) return animalCategories;

    return animalCategories.filter((cat) =>
      product.animalTypeIds.includes(cat.animalTypeId)
    );
  }, [animalCategories, product.animalTypeIds]);

  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      animalCategoryIds: prev.animalCategoryIds.filter((id) =>
        filteredAnimalCategories.some((cat) => cat.id === id)
      ),
    }));
  }, [filteredAnimalCategories]);

  const toggleIdInArray = (arr: number[], id: number) => {
    return arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadImage(file);

      setProduct((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, res.url],
      }));
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (url: string) => {
    setProduct((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((x) => x !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.title.trim()) {
      alert("Title is required");
      return;
    }

    if (product.price < 0) {
      alert("Price cannot be negative");
      return;
    }

    if (product.discountPercent < 0 || product.discountPercent > 100) {
      alert("Discount percent must be between 0 and 100");
      return;
    }

    if (product.quantityOnHand < 0) {
      alert("Quantity on hand cannot be negative");
      return;
    }

    try {
      setIsSaving(true);

      await onSubmit({
        ...product,
        title: product.title.trim(),
        description: product.description?.trim() || "",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            placeholder="Enter product title"
            value={product.title}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            placeholder="Enter product description"
            value={product.description}
            onChange={(e) =>
              setProduct((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={product.price}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Discount Percent</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={product.discountPercent}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  discountPercent: Number(e.target.value),
                }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Quantity On Hand</label>
            <input
              type="number"
              min="0"
              step="1"
              value={product.quantityOnHand}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  quantityOnHand: Number(e.target.value),
                }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={product.status}
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                status: Number(e.target.value),
              }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value={0}>Draft</option>
            <option value={1}>Active</option>
            <option value={2}>Archived</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-base font-semibold">Images</h3>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          {isUploading && (
            <p className="mt-2 text-sm text-muted-foreground">Uploading image...</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {product.imageUrls.map((url) => (
            <div key={url} className="relative">
              <img
                src={resolveMediaUrl(url)}
                alt="Product"
                className="h-24 w-24 rounded-lg object-cover border border-border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(url)}
                className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white shadow"
              >
                ×
              </button>
            </div>
          ))}

          {!product.imageUrls.length && (
            <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-base font-semibold">Animal Types</h3>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {animalTypes
            .filter((x) => x.isActive)
            .map((type) => (
              <label
                key={type.id}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={product.animalTypeIds.includes(type.id)}
                  onChange={() =>
                    setProduct((prev) => ({
                      ...prev,
                      animalTypeIds: toggleIdInArray(prev.animalTypeIds, type.id),
                    }))
                  }
                />
                <span>{type.name}</span>
              </label>
            ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-base font-semibold">Animal Categories</h3>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filteredAnimalCategories
            .filter((x) => x.isActive)
            .map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={product.animalCategoryIds.includes(category.id)}
                  onChange={() =>
                    setProduct((prev) => ({
                      ...prev,
                      animalCategoryIds: toggleIdInArray(prev.animalCategoryIds, category.id),
                    }))
                  }
                />
                <span>{category.name}</span>
              </label>
            ))}
        </div>

        {!filteredAnimalCategories.length && (
          <p className="mt-2 text-sm text-muted-foreground">
            Select animal type first to narrow categories.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-base font-semibold">Product Type Categories</h3>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {productTypeCategories
            .filter((x) => x.isActive)
            .map((type) => (
              <label
                key={type.id}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={product.productTypeCategoryIds.includes(type.id)}
                  onChange={() =>
                    setProduct((prev) => ({
                      ...prev,
                      productTypeCategoryIds: toggleIdInArray(
                        prev.productTypeCategoryIds,
                        type.id
                      ),
                    }))
                  }
                />
                <span>{type.name}</span>
              </label>
            ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-lg bg-primary px-6 py-2 text-white disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}