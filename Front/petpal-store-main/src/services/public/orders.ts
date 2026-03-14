import { api } from "@/lib/api";
import type { OrderRequest, OrderResponse } from "@/lib/types";

export async function placeOrder(data: OrderRequest) {
  const res = await api.post<OrderResponse>("/orders", data);
  return res.data;
}