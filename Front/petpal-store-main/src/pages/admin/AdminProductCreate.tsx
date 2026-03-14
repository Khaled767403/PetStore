import { useNavigate } from "react-router-dom";
import { createProduct } from "@/services/admin/products";
import AdminProductForm from "./AdminProductForm";

export default function AdminProductCreate() {
  const navigate = useNavigate();

  const handleCreate = async (data: any) => {
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