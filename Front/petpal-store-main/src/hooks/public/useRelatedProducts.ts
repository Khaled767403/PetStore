import { useQuery } from "@tanstack/react-query";
import { getRelatedProducts } from "@/services/public/products";

export function useRelatedProducts(id?: number) {
  return useQuery({
    queryKey: ["related-products", id],
    queryFn: () => getRelatedProducts(id!),
    enabled: !!id,
  });
}