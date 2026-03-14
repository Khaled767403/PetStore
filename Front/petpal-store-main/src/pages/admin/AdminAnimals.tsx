import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  getAnimalTypes,
  getAnimalCategories,
  createAnimalType,
} from "@/services/admin/catalog";
import AdminAnimalForm from "./AdminAnimalForm";
import defaultAnimalImage from "@/assets/pets/defult image.png";
import { resolveMediaUrl } from "@/lib/media";

type AnimalTypeDto = {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
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

export default function AdminAnimals() {
  const [animalTypes, setAnimalTypes] = useState<AnimalTypeDto[]>([]);
  const [categories, setCategories] = useState<AnimalCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [typesRes, categoriesRes] = await Promise.all([
        getAnimalTypes(),
        getAnimalCategories(),
      ]);

      setAnimalTypes(typesRes ?? []);
      setCategories(categoriesRes ?? []);
    } catch (error) {
      console.error("Failed to load animal types", error);
      alert("Failed to load animal types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAnimalType = async (data: {
    name: string;
    slug: string;
    imageUrl: string | null;
  }) => {
    try {
      setSaving(true);

      await createAnimalType({
        name: data.name,
        slug: data.slug,
        imageUrl: data.imageUrl,
      });

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Failed to create animal type", error);
      alert("Failed to create animal type");
    } finally {
      setSaving(false);
    }
  };

  const getCategoryCount = (animalTypeId: number) =>
    categories.filter((c) => c.animalTypeId === animalTypeId).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Animal Types</h1>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Animal Type
        </button>
      </div>

      {showForm && (
        <AdminAnimalForm
          saving={saving}
          onSubmit={handleCreateAnimalType}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Loading animal types...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {animalTypes.map((animal) => {
            const imageSrc = animal.imageUrl
              ? resolveMediaUrl(animal.imageUrl)
              : defaultAnimalImage;

            return (
              <div
                key={animal.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={imageSrc}
                    alt={animal.name}
                    className="h-16 w-16 rounded-xl border border-border object-cover bg-muted"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-medium">{animal.name}</h3>

                    <p className="text-sm text-muted-foreground">
                      {getCategoryCount(animal.id)} categories
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      slug: {animal.slug}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      ID: {animal.id}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {!animalTypes.length && (
            <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
              No animal types found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}