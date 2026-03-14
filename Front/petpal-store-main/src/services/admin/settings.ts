import { api } from "@/lib/api";

export async function getSettings() {
  const res = await api.get("/admin/settings");
  return res.data;
}

export async function updateSettings(data: any) {
  const res = await api.put("/admin/settings", data);
  return res.data;
}