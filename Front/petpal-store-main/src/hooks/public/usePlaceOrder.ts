import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/services/public/orders";

export function usePlaceOrder() {
  return useMutation({
    mutationFn: placeOrder
  });
}