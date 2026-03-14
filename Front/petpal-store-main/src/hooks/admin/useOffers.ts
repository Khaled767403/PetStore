import { useQuery } from "@tanstack/react-query";
import { getOffers } from "@/services/admin/offers";
import type { Offer } from "@/lib/types";

export function useOffers(active?: boolean) {
  return useQuery<Offer[]>({
    queryKey: ["admin-offers", active],
    queryFn: () => getOffers(active),
  });
}