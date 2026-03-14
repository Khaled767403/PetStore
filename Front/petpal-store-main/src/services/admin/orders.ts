import { api } from "@/lib/api";
import type { Order, OrderDetails, PagedResult } from "@/lib/types";

export async function getAdminOrders(params?: {
  status?: number;
  page?: number;
  pageSize?: number;
}) {
  const res = await api.get<PagedResult<Order>>("/admin/orders", { params });
  return res.data;
}

export async function getAdminOrder(id: number) {
  const res = await api.get<OrderDetails>(`/admin/orders/${id}`);
  return res.data;
}

export async function updateOrderStatus(id: number, status: number) {
  const res = await api.patch(`/admin/orders/${id}/status`, { status });
  return res.data;
}