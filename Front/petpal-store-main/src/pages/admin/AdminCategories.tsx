import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  getAnimalTypes,
  getAnimalCategories,
  getProductTypeCategories,
  createAnimalCategory,
  createProductTypeCategory,
} from "@/services/admin/catalog";

type AnimalTypeDto = {
  id: number;
  name: string;
  slug: string;
  isActive?: boolean;
};

type AnimalCategoryDto = {
  id: number;
  animalTypeId: number;
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
  isActive?: boolean;
};

type ProductTypeCategoryDto = {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
  isActive?: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

export default function AdminCategories() {
  const [tab, setTab] = useState<"animal" | "productType">("animal");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [animalTypes, setAnimalTypes] = useState<AnimalTypeDto[]>([]);
  const [animalCategories, setAnimalCategories] = useState<AnimalCategoryDto[]>([]);
  const [productTypeCategories, setProductTypeCategories] = useState<ProductTypeCategoryDto[]>([]);

  const [animalForm, setAnimalForm] = useState({
    animalTypeId: 0,
    parentId: "",
    name: "",
    slug: "",
    sortOrder: 0,
  });

  const [productTypeForm, setProductTypeForm] = useState({
    parentId: "",
    name: "",
    slug: "",
    sortOrder: 0,
  });

  const loadData = async () => {
    try {
      const [typesRes, animalCategoriesRes, productTypeCategoriesRes] =
        await Promise.all([
          getAnimalTypes(),
          getAnimalCategories(),
          getProductTypeCategories(),
        ]);

      setAnimalTypes(typesRes);
      setAnimalCategories(animalCategoriesRes);
      setProductTypeCategories(productTypeCategoriesRes);
    } catch (error) {
      console.error("Failed to load categories", error);
      alert("Failed to load categories");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAnimalParents = useMemo(() => {
    if (!animalForm.animalTypeId) return [];
    return animalCategories.filter(
      (x) => x.animalTypeId === animalForm.animalTypeId
    );
  }, [animalCategories, animalForm.animalTypeId]);

  const handleCreateAnimalCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!animalForm.animalTypeId || !animalForm.name.trim()) {
      alert("Animal type and category name are required");
      return;
    }

    try {
      setSaving(true);

      await createAnimalCategory({
        animalTypeId: animalForm.animalTypeId,
        parentId: animalForm.parentId ? Number(animalForm.parentId) : null,
        name: animalForm.name.trim(),
        slug: (animalForm.slug || slugify(animalForm.name)).trim(),
        sortOrder: Number(animalForm.sortOrder || 0),
      });

      setAnimalForm({
        animalTypeId: 0,
        parentId: "",
        name: "",
        slug: "",
        sortOrder: 0,
      });

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Failed to create animal category", error);
      alert("Failed to create animal category");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateProductTypeCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productTypeForm.name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setSaving(true);

      await createProductTypeCategory({
        parentId: productTypeForm.parentId ? Number(productTypeForm.parentId) : null,
        name: productTypeForm.name.trim(),
        slug: (productTypeForm.slug || slugify(productTypeForm.name)).trim(),
        sortOrder: Number(productTypeForm.sortOrder || 0),
      });

      setProductTypeForm({
        parentId: "",
        name: "",
        slug: "",
        sortOrder: 0,
      });

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Failed to create product type category", error);
      alert("Failed to create product type category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Categories</h1>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          type="button"
          onClick={() => setTab("animal")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            tab === "animal"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card"
          }`}
        >
          Animal Categories
        </button>

        <button
          type="button"
          onClick={() => setTab("productType")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            tab === "productType"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card"
          }`}
        >
          Product Type Categories
        </button>
      </div>

      {showForm && tab === "animal" && (
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Create Animal Category</h2>

          <form onSubmit={handleCreateAnimalCategory} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Animal Type</label>
              <select
                value={animalForm.animalTypeId}
                onChange={(e) =>
                  setAnimalForm((prev) => ({
                    ...prev,
                    animalTypeId: Number(e.target.value),
                    parentId: "",
                  }))
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
              >
                <option value={0}>Select animal type</option>
                {animalTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Parent Category</label>
              <select
                value={animalForm.parentId}
                onChange={(e) =>
                  setAnimalForm((prev) => ({ ...prev, parentId: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
              >
                <option value="">No parent</option>
                {filteredAnimalParents.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                value={animalForm.name}
                onChange={(e) =>
                  setAnimalForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: prev.slug ? prev.slug : slugify(e.target.value),
                  }))
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Slug</label>
              <input
                value={animalForm.slug}
                onChange={(e) =>
                  setAnimalForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Sort Order</label>
              <input
                type="number"
                value={animalForm.sortOrder}
                onChange={(e) =>
                  setAnimalForm((prev) => ({
                    ...prev,
                    sortOrder: Number(e.target.value),
                  }))
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Animal Category"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showForm && tab === "productType" && (
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-semibold">Create Product Type Category</h2>

          <form onSubmit={handleCreateProductTypeCategory} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Parent Category</label>
              <select
                value={productTypeForm.parentId}
                onChange={(e) =>
                  setProductTypeForm((prev) => ({ ...prev, parentId: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
              >
                <option value="">No parent</option>
                {productTypeCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Sort Order</label>
              <input
                type="number"
                value={productTypeForm.sortOrder}
                onChange={(e) =>
                  setProductTypeForm((prev) => ({
                    ...prev,
                    sortOrder: Number(e.target.value),
                  }))
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                value={productTypeForm.name}
                onChange={(e) =>
                  setProductTypeForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: prev.slug ? prev.slug : slugify(e.target.value),
                  }))
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Slug</label>
              <input
                value={productTypeForm.slug}
                onChange={(e) =>
                  setProductTypeForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Product Type Category"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {tab === "animal" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {animalCategories.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-border bg-card p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground">slug: {item.slug}</p>
                <p className="text-xs text-muted-foreground">
                  Animal Type ID: {item.animalTypeId}
                </p>
              </div>

              <span className="text-xs text-muted-foreground">ID: {item.id}</span>
            </div>
          ))}

          {!animalCategories.length && (
            <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
              No animal categories found.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {productTypeCategories.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-border bg-card p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground">slug: {item.slug}</p>
                <p className="text-xs text-muted-foreground">
                  Parent ID: {item.parentId ?? "None"}
                </p>
              </div>

              <span className="text-xs text-muted-foreground">ID: {item.id}</span>
            </div>
          ))}

          {!productTypeCategories.length && (
            <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
              No product type categories found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}