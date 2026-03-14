import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdminOrder, updateOrderStatus } from "@/services/admin/orders";

export default function AdminOrderDetail() {
  const { id } = useParams();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => getAdminOrder(Number(id))
  });

  if (isLoading) return <p>Loading order...</p>;

  const order = data;

  const handleStatus = async (status: number) => {
    await updateOrderStatus(order.id, status);
    refetch();
  };

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Order #{order.orderNumber}
      </h1>

      <div className="bg-card border rounded-lg p-6 space-y-2">

        <p><b>Customer:</b> {order.customerName}</p>
        <p><b>Phone:</b> {order.customerPhone}</p>
        <p><b>Address:</b> {order.customerAddress}</p>

        <p><b>Total:</b> {order.total} EGP</p>

        <p><b>Status:</b> {order.status}</p>

      </div>

      <div className="flex gap-3">

        <button
          onClick={() => handleStatus(1)}
          className="bg-success text-white px-4 py-2 rounded"
        >
          Confirm
        </button>

        <button
          onClick={() => handleStatus(2)}
          className="bg-sale text-white px-4 py-2 rounded"
        >
          Reject
        </button>

        <button
          onClick={() => handleStatus(3)}
          className="bg-muted px-4 py-2 rounded"
        >
          Cancel
        </button>

      </div>

      <h2 className="text-xl font-bold mt-6">Items</h2>

      <div className="border rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item:any)=>(
              <tr key={item.id} className="border-t">
                <td className="p-3 flex items-center gap-2">

                  <img
                    src={item.productMainImageSnapshot}
                    className="h-10 w-10 object-cover rounded"
                  />

                  {item.productTitleSnapshot}

                </td>

                <td className="p-3">{item.unitPriceSnapshot}</td>

                <td className="p-3">{item.quantity}</td>

                <td className="p-3">
                  {item.unitPriceSnapshot * item.quantity}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}