import { api } from "@/lib/api";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/admin/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}