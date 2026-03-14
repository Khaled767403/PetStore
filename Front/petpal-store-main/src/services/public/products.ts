import { api } from "@/lib/api";
import type { PagedResult, Product, ProductDetails } from "@/lib/types";

export async function getProducts(params?: {
  q?: string;
  animalTypeId?: number;
  animalCategoryId?: number;
  productTypeCategoryId?: number;
  page?: number;
  pageSize?: number;
}) {
  const res = await api.get<PagedResult<Product>>("/products", { params });
  return res.data;
}

export async function getProduct(id: number) {
  const res = await api.get<ProductDetails>(`/products/${id}`);
  return res.data;
}

export async function getRelatedProducts(id: number) {
  const res = await api.get<Product[]>(`/products/${id}/related`);
  return res.data;
}

export async function rateProduct(id: number, stars: number) {
  const res = await api.post(`/products/${id}/rate`, { stars });
  return res.data;
}