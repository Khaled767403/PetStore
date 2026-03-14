import { api } from "@/lib/api";
import type { TreesResponse } from "@/lib/types";

export async function getTrees() {
  const res = await api.get<TreesResponse>("/trees");
  return res.data;
}