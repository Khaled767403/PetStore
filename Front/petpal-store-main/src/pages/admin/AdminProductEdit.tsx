import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdminProduct, updateProduct } from "@/services/admin/products";
import AdminProductForm from "./AdminProductForm";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getAdminProduct(Number(id)),
  });

  const handleUpdate = async (dataForm: any) => {
    await updateProduct(Number(id), dataForm);
    navigate("/admin/products");
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Edit Product</h1>

      <AdminProductForm
        initialData={data}
        onSubmit={handleUpdate}
      />
    </div>
  );
}