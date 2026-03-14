import { useQuery } from "@tanstack/react-query";
import { getAdminOrders } from "@/services/admin/orders";
import type { Order, PagedResult } from "@/lib/types";

type UseAdminOrdersParams = {
  status?: number;
  page?: number;
  pageSize?: number;
};

export function useAdminOrders(params: UseAdminOrdersParams = {}) {
  return useQuery<PagedResult<Order>>({
    queryKey: ["admin-orders", params],
    queryFn: () => getAdminOrders(params),
  });
}