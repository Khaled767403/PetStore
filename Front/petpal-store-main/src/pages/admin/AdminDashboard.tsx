import { useMemo, useState } from "react";
import { Package, ShoppingCart, Tag, DollarSign, Clock3, XCircle } from "lucide-react";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import { useAdminOrders } from "@/hooks/admin/useAdminOrders";
import { useOffers } from "@/hooks/admin/useOffers";
import type { Order } from "@/lib/types";

const orderStatusLabels: Record<number, string> = {
  0: "Pending Payment",
  1: "Confirmed",
  2: "Rejected",
  3: "Cancelled",
  4: "Expired",
};

function formatDateInput(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWithinRange(dateValue: string, from: string, to: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T23:59:59`);

  return date >= start && date <= end;
}

function buildRevenueSeries(orders: Order[], from: string, to: string) {
  const confirmed = orders.filter(
    (order) =>
      order.status === 1 &&
      isWithinRange(order.confirmedAt || order.createdAt, from, to)
  );

  const map = new Map<string, number>();

  confirmed.forEach((order) => {
    const key = new Date(order.confirmedAt || order.createdAt)
      .toISOString()
      .slice(0, 10);

    map.set(key, (map.get(key) || 0) + Number(order.total || 0));
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date, total }));
}

export default function AdminDashboard() {
  const today = new Date();
  const last30 = new Date();
  last30.setDate(today.getDate() - 30);

  const [fromDate, setFromDate] = useState(formatDateInput(last30));
  const [toDate, setToDate] = useState(formatDateInput(today));

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useAdminProducts({
    page: 1,
    pageSize: 1,
  });

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useAdminOrders({
    page: 1,
    pageSize: 1000,
  });

  const {
    data: offersData,
    isLoading: offersLoading,
    isError: offersError,
  } = useOffers(true);

  const allOrders = ordersData?.items ?? [];

  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) =>
      isWithinRange(order.createdAt, fromDate, toDate)
    );
  }, [allOrders, fromDate, toDate]);

  const totalProducts = productsData?.totalCount ?? 0;
  const totalOrders = ordersData?.totalCount ?? 0;
  const activeOffers = offersData?.length ?? 0;

  const pendingOrdersCount = filteredOrders.filter((o) => o.status === 0).length;
  const confirmedOrdersCount = filteredOrders.filter((o) => o.status === 1).length;
  const rejectedOrdersCount = filteredOrders.filter((o) => o.status === 2).length;
  const cancelledOrdersCount = filteredOrders.filter(
    (o) => o.status === 3 || o.status === 4
  ).length;

  const confirmedRevenue = filteredOrders
    .filter((o) => o.status === 1)
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const revenueSeries = useMemo(
    () => buildRevenueSeries(allOrders, fromDate, toDate),
    [allOrders, fromDate, toDate]
  );

  const maxRevenue = Math.max(...revenueSeries.map((x) => x.total), 1);

  const statusChart = [
    { label: "Pending", value: pendingOrdersCount, color: "bg-yellow-400" },
    { label: "Confirmed", value: confirmedOrdersCount, color: "bg-emerald-500" },
    { label: "Rejected", value: rejectedOrdersCount, color: "bg-red-500" },
    { label: "Cancelled / Expired", value: cancelledOrdersCount, color: "bg-slate-400" },
  ];

  const maxStatusValue = Math.max(...statusChart.map((x) => x.value), 1);

  const recentOrders = filteredOrders.slice(0, 5);

  const stats = [
    {
      label: "Total Products",
      value: productsLoading ? "..." : String(totalProducts),
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Total Orders",
      value: ordersLoading ? "..." : String(totalOrders),
      icon: ShoppingCart,
      color: "bg-accent/20 text-accent-foreground",
    },
    {
      label: "Active Offers",
      value: offersLoading ? "..." : String(activeOffers),
      icon: Tag,
      color: "bg-success/10 text-success",
    },
    {
      label: "Confirmed Revenue",
      value: ordersLoading ? "..." : `${confirmedRevenue.toFixed(2)} EGP`,
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-700",
    },
  ];

  const hasTopLevelError = productsError || ordersError || offersError;

  return (
    <div>
      <div className="mb-6 rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-heading font-bold">Sales Analytics</h2>
            <p className="text-sm text-muted-foreground">
              Revenue is calculated from confirmed orders only.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {hasTopLevelError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load some dashboard data. Please refresh the page.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Revenue chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-heading font-bold">
              Confirmed Revenue by Day
            </h2>
          </div>

          {ordersLoading ? (
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          ) : revenueSeries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No confirmed orders found in selected period.
            </p>
          ) : (
            <div className="space-y-3">
              {revenueSeries.map((item) => (
                <div key={item.date}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.date}</span>
                    <span className="font-medium">{item.total.toFixed(2)} EGP</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.max((item.total / maxRevenue) * 100, 6)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-heading font-bold">
              Orders Status Summary
            </h2>
          </div>

          {ordersLoading ? (
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          ) : (
            <div className="space-y-4">
              {statusChart.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${Math.max((item.value / maxStatusValue) * 100, item.value > 0 ? 8 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status cards */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-heading font-bold">Status Numbers</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-yellow-700" />
                <span className="text-sm text-yellow-800">Pending Payment</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">
                {pendingOrdersCount}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-emerald-700" />
                <span className="text-sm text-emerald-800">Confirmed</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900">
                {confirmedOrdersCount}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-700" />
                <span className="text-sm text-red-800">Rejected</span>
              </div>
              <p className="text-2xl font-bold text-red-900">
                {rejectedOrdersCount}
              </p>
            </div>

            <div className="rounded-lg bg-slate-100 p-4">
              <div className="mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-slate-700" />
                <span className="text-sm text-slate-800">Cancelled / Expired</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {cancelledOrdersCount}
              </p>
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-heading font-bold">
            Recent Orders in Selected Period
          </h2>

          {ordersLoading ? (
            <p className="text-sm text-muted-foreground">Loading orders...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No orders found in selected period.
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{order.total} EGP</p>
                    <p className="text-xs text-muted-foreground">
                      {orderStatusLabels[order.status] ?? `Status ${order.status}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
            This dashboard now uses real backend data.  
            For very large order history, a dedicated backend analytics endpoint
            will be better than loading a large orders page.
          </div>
        </div>
      </div>
    </div>
  );
}