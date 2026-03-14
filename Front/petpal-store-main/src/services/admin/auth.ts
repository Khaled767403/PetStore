import { api } from "@/lib/api";

export async function adminLogin(username: string, password: string) {
  const res = await api.post("/admin/auth/login", {
    username,
    password,
  });

  return res.data;
}