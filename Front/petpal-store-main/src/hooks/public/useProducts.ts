import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/public/products";

export function useProducts(params?: any) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}

