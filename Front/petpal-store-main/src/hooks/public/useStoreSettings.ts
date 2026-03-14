import { useQuery } from "@tanstack/react-query";
import { getStoreSettings } from "@/services/public/settings";
import type { StoreSettings } from "@/lib/types";

export function useStoreSettings() {
  return useQuery<StoreSettings>({
    queryKey: ["store-settings"],
    queryFn: getStoreSettings,
  });
}