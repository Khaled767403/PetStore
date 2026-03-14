import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "@/services/admin/products";
import type { PagedResult, Product } from "@/lib/types";

type UseAdminProductsParams = {
  q?: string;
  status?: number;
  offersFirst?: boolean;
  page?: number;
  pageSize?: number;
};

export function useAdminProducts(params: UseAdminProductsParams = {}) {
  return useQuery<PagedResult<Product>>({
    queryKey: ["admin-products", params],
    queryFn: () => getAdminProducts(params),
  });
}