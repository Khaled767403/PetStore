import { api } from "@/lib/api";

export async function getOffers(active?: boolean) {
  const res = await api.get("/admin/offers", {
    params: typeof active === "boolean" ? { active } : {},
  });
  return res.data ?? [];
}

export async function getOfferById(id: number) {
  const offers = await getOffers();
  return (offers || []).find((x: any) => x.id === id) ?? null;
}

export async function createOffer(data: {
  percent: number;
  scopeType: number;
  scopeId: number;
  startAt: string | null;
  endAt: string | null;
  isActive: boolean;
}) {
  const res = await api.post("/admin/offers", data);
  return res.data;
}

export async function updateOffer(
  id: number,
  data: {
    percent: number;
    scopeType: number;
    scopeId: number;
    startAt: string | null;
    endAt: string | null;
    isActive: boolean;
  }
) {
  const res = await api.put(`/admin/offers/${id}`, data);
  return res.data;
}

export async function disableOffer(id: number) {
  const res = await api.delete(`/admin/offers/${id}`);
  return res.data;
}