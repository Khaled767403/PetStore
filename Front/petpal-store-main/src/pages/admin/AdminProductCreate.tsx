import { useNavigate } from "react-router-dom";
import { createProduct } from "@/services/admin/products";
import AdminProductForm from "./AdminProductForm";
import { resolveMediaUrl } from "@/lib/media";

export default function AdminProductCreate() {
  const navigate = useNavigate();

  const handleCreate = async (data: any) => {
    // إذا في صورة، حل الرابط قبل الإرسال (اختياري)
    if (data.mainImageUrl) {
      data.mainImageUrl = resolveMediaUrl(data.mainImageUrl);
    }

    await createProduct(data);
    navigate("/admin/products");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Create Product</h1>
      <AdminProductForm onSubmit={handleCreate} />
    </div>
  );
}