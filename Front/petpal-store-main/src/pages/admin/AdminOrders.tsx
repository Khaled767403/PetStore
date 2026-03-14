import { useQuery } from "@tanstack/react-query";
import { getAdminOrders, updateOrderStatus } from "@/services/admin/orders";

const statusLabels: Record<number, { label: string; class: string }> = {
  0: { label: "Pending Payment", class: "bg-accent/20 text-accent-foreground" },
  1: { label: "Confirmed", class: "bg-success/10 text-success" },
  2: { label: "Rejected", class: "bg-sale/10 text-sale" },
  3: { label: "Cancelled", class: "bg-muted text-muted-foreground" },
  4: { label: "Expired", class: "bg-muted text-muted-foreground" },
};

export default function AdminOrders() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });

  const orders = data?.items || data || [];

  const handleStatusChange = async (id: number, status: number) => {
    await updateOrderStatus(id, status);
    refetch();
  };

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div>
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Order #
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Customer
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Total
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order: any) => {
              const s = statusLabels[order.status];

              return (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">
                    {order.orderNumber}
                  </td>

                  <td className="px-4 py-3">{order.customerName}</td>

                  <td className="px-4 py-3">{order.total} EGP</td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.class}`}
                    >
                      {s.label}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {order.createdAt}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, Number(e.target.value))
                      }
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      <option value={0}>Pending</option>
                      <option value={1}>Confirm</option>
                      <option value={2}>Reject</option>
                      <option value={3}>Cancel</option>
                      <option value={4}>Expire</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}