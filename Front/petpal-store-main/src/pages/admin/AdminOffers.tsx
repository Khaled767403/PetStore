import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOffers, disableOffer } from "@/services/admin/offers";

type OfferDto = {
  id: number;
  scopeType: number;
  scopeId: number;
  percent: number;
  isActive: boolean;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
};

function formatScope(scopeType: number, scopeId: number) {
  const scopeMap: Record<number, string> = {
    1: "Animal Type",
    2: "Animal Category",
    3: "Product Type Category",
  };

  return `${scopeMap[scopeType] ?? "Unknown"} #${scopeId}`;
}

function formatDate(value: string | null) {
  if (!value) return "No limit";
  return new Date(value).toLocaleDateString();
}

export default function AdminOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOnly, setActiveOnly] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getOffers(activeOnly);
      setOffers(data);
    } catch (error) {
      console.error("Failed to load offers", error);
      alert("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeOnly]);

  const handleDisable = async (id: number) => {
    const ok = window.confirm("Are you sure you want to disable this offer?");
    if (!ok) return;

    try {
      await disableOffer(id);
      await loadData();
    } catch (error) {
      console.error("Failed to disable offer", error);
      alert("Failed to disable offer");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Offers</h1>

        <button
          type="button"
          onClick={() => navigate("/admin/offers/new")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Offer
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveOnly(true)}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            activeOnly
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card"
          }`}
        >
          Active Only
        </button>

        <button
          type="button"
          onClick={() => setActiveOnly(false)}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            !activeOnly
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card"
          }`}
        >
          Inactive Only
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Loading offers...
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Discount
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Scope
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Period
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-semibold text-sale">
                    {offer.percent}%
                  </td>

                  <td className="px-4 py-3">
                    {formatScope(offer.scopeType, offer.scopeId)}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(offer.startAt)} → {formatDate(offer.endAt)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        offer.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {offer.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/offers/${offer.id}/edit`)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                      >
                        Edit
                      </button>

                      {offer.isActive && (
                        <button
                          type="button"
                          onClick={() => handleDisable(offer.id)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Disable
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {!offers.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No offers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}