import { api } from "@/lib/api";

export const getAnimalTypes = async () => {
  const res = await api.get("/admin/catalog/animal-types");
  return res.data ?? [];
};

export const getAnimalCategories = async (animalTypeId?: number) => {
  const res = await api.get("/admin/catalog/animal-categories", {
    params: animalTypeId ? { animalTypeId } : {},
  });
  return res.data ?? [];
};

export const getProductTypeCategories = async () => {
  const res = await api.get("/admin/catalog/product-type-categories");
  return res.data ?? [];
};

export const createAnimalType = async (data: {
  name: string;
  slug: string;
  imageUrl?: string | null;
}) => {
  const res = await api.post("/admin/catalog/animal-types", data);
  return res.data;
};

export const createAnimalCategory = async (data: {
  animalTypeId: number;
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
}) => {
  const res = await api.post("/admin/catalog/animal-categories", data);
  return res.data;
};

export const createProductTypeCategory = async (data: {
  parentId: number | null;
  name: string;
  slug: string;
  sortOrder: number;
}) => {
  const res = await api.post("/admin/catalog/product-type-categories", data);
  return res.data;
};