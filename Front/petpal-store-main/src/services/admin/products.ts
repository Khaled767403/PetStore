import { api } from "@/lib/api";

export async function getAdminProducts(params?: any) {
  const res = await api.get("/admin/products", { params });
  return res.data;
}

export async function getAdminProduct(id: number) {
  const res = await api.get(`/admin/products/${id}`);
  return res.data;
}

export async function createProduct(data: any) {
  const res = await api.post("/admin/catalog/products", data);
  return res.data;
}

export async function updateProduct(id: number, data: any) {
  const res = await api.put(`/admin/catalog/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id: number) {
  const res = await api.delete(`/admin/catalog/products/${id}`);
  return res.data;
}