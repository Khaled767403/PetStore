import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createOffer,
  getOfferById,
  updateOffer,
} from "@/services/admin/offers";
import {
  getAnimalTypes,
  getAnimalCategories,
  getProductTypeCategories,
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

type OfferFormState = {
  percent: number;
  scopeType: number;
  scopeId: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
};

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function AdminOfferForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [animalTypes, setAnimalTypes] = useState<AnimalTypeDto[]>([]);
  const [animalCategories, setAnimalCategories] = useState<AnimalCategoryDto[]>([]);
  const [productTypeCategories, setProductTypeCategories] = useState<ProductTypeCategoryDto[]>([]);

  const [offer, setOffer] = useState<OfferFormState>({
    percent: 0,
    scopeType: 1,
    scopeId: 0,
    startAt: "",
    endAt: "",
    isActive: true,
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [typesRes, categoriesRes, productTypesRes] = await Promise.all([
          getAnimalTypes(),
          getAnimalCategories(),
          getProductTypeCategories(),
        ]);

        setAnimalTypes(typesRes ?? []);
        setAnimalCategories(categoriesRes ?? []);
        setProductTypeCategories(productTypesRes ?? []);
      } catch (error) {
        console.error("Failed to load offer form options", error);
        alert("Failed to load offer form options");
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const loadOffer = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getOfferById(Number(id));

        if (!data) {
          alert("Offer not found");
          navigate("/admin/offers");
          return;
        }

        setOffer({
          percent: Number(data.percent ?? 0),
          scopeType: Number(data.scopeType ?? 1),
          scopeId: Number(data.scopeId ?? 0),
          startAt: toDateTimeLocal(data.startAt),
          endAt: toDateTimeLocal(data.endAt),
          isActive: Boolean(data.isActive),
        });
      } catch (error) {
        console.error("Failed to load offer", error);
        alert("Failed to load offer");
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [id, navigate]);

  const scopeOptions = useMemo(() => {
    if (offer.scopeType === 1) {
      return animalTypes
        .filter((x) => x.isActive ?? true)
        .map((x) => ({
          value: x.id,
          label: x.name,
        }));
    }

    if (offer.scopeType === 2) {
      return animalCategories
        .filter((x) => x.isActive ?? true)
        .map((x) => ({
          value: x.id,
          label: x.name,
        }));
    }

    if (offer.scopeType === 3) {
      return productTypeCategories
        .filter((x) => x.isActive ?? true)
        .map((x) => ({
          value: x.id,
          label: x.name,
        }));
    }

    return [];
  }, [offer.scopeType, animalTypes, animalCategories, productTypeCategories]);

  useEffect(() => {
    const exists = scopeOptions.some((x) => x.value === offer.scopeId);
    if (!exists) {
      setOffer((prev) => ({
        ...prev,
        scopeId: 0,
      }));
    }
  }, [scopeOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (offer.percent < 0 || offer.percent > 100) {
      alert("Discount percent must be between 0 and 100");
      return;
    }

    if (!offer.scopeType) {
      alert("Scope type is required");
      return;
    }

    if (!offer.scopeId) {
      alert("Please choose a target scope item");
      return;
    }

    const payload = {
      percent: Number(offer.percent),
      scopeType: Number(offer.scopeType),
      scopeId: Number(offer.scopeId),
      startAt: offer.startAt ? new Date(offer.startAt).toISOString() : null,
      endAt: offer.endAt ? new Date(offer.endAt).toISOString() : null,
      isActive: offer.isActive,
    };

    try {
      setSaving(true);

      if (isEditMode && id) {
        await updateOffer(Number(id), payload);
        alert("Offer updated successfully");
      } else {
        await createOffer(payload);
        alert("Offer created successfully");
      }

      navigate("/admin/offers");
    } catch (error) {
      console.error("Failed to save offer", error);
      alert("Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
        Loading offer...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold">
          {isEditMode ? "Edit Offer" : "Create Offer"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create discount offers for animal types, animal categories, or product type categories.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Discount Percent</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={offer.percent}
            onChange={(e) =>
              setOffer((prev) => ({
                ...prev,
                percent: Number(e.target.value),
              }))
            }
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Scope Type</label>
          <select
            value={offer.scopeType}
            onChange={(e) =>
              setOffer((prev) => ({
                ...prev,
                scopeType: Number(e.target.value),
                scopeId: 0,
              }))
            }
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
          >
            <option value={1}>Animal Type</option>
            <option value={2}>Animal Category</option>
            <option value={3}>Product Type Category</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Target</label>
          <select
            value={offer.scopeId}
            onChange={(e) =>
              setOffer((prev) => ({
                ...prev,
                scopeId: Number(e.target.value),
              }))
            }
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
          >
            <option value={0}>Select target</option>
            {scopeOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Start At</label>
            <input
              type="datetime-local"
              value={offer.startAt}
              onChange={(e) =>
                setOffer((prev) => ({
                  ...prev,
                  startAt: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">End At</label>
            <input
              type="datetime-local"
              value={offer.endAt}
              onChange={(e) =>
                setOffer((prev) => ({
                  ...prev,
                  endAt: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={offer.isActive}
            onChange={(e) =>
              setOffer((prev) => ({
                ...prev,
                isActive: e.target.checked,
              }))
            }
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Active
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {saving
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
              ? "Update Offer"
              : "Save Offer"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/offers")}
            className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}