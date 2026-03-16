import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cart-store";
import { MessageCircle } from "lucide-react";
import { usePlaceOrder } from "@/hooks/public/usePlaceOrder";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const { mutateAsync, data: orderResult, isPending } = usePlaceOrder();

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
    paymentMethod: 0,
    walletNumber: "",
    instaPayHandle: "",
  });

  if (items.length === 0 && !orderResult) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const extraPaymentInfo =
      form.paymentMethod === 0 && form.instaPayHandle
        ? `\nCustomer InstaPay Handle: ${form.instaPayHandle}`
        : form.paymentMethod === 1 && form.walletNumber
        ? `\nCustomer Wallet Number: ${form.walletNumber}`
        : "";

    const payload = {
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerAddress: form.customerAddress,
      notes: `${form.notes || ""}${extraPaymentInfo}`.trim(),
      paymentMethod: form.paymentMethod,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    await mutateAsync(payload);
    clearCart();
  };

  const handleOpenWhatsApp = () => {
  let link =
    (orderResult as any)?.whatsappUrl ||
    (orderResult as any)?.whatsAppUrl;

  if (!link) {
    console.log("Order result object:", orderResult);
    alert("WhatsApp link is missing.");
    return;
  }

  // 👇 الجزء السحري هنا:
  // بنقول للكود: لو لقيت نص مكتوب فيه \n (حرفين) حولهم لسطر حقيقي يفهمه الواتساب
  link = link.replace(/\\n/g, '%0A');

  window.open(link, "_blank", "noopener,noreferrer");
};

  if (orderResult) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg text-center">
        <div className="rounded-lg border border-border bg-card p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <span className="text-3xl">✅</span>
          </div>

          <h1 className="text-2xl font-heading font-bold mb-2">
            Order Placed!
          </h1>

          <p className="text-muted-foreground mb-4">
            Order #{orderResult.orderNumber}
          </p>

          <div className="rounded-lg bg-muted p-4 text-sm mb-6">
            <p className="font-medium text-foreground mb-1">
              Payment Instructions:
            </p>
            <p className="text-muted-foreground whitespace-pre-line">
              {orderResult.paymentInstructions}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center gap-2 rounded-full bg-success px-6 py-3 font-heading font-semibold text-success-foreground hover:bg-success/90 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Send Order on WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-heading font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            required
            value={form.customerName}
            onChange={(e) =>
              setForm({ ...form, customerName: e.target.value })
            }
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number *
          </label>
          <input
            required
            value={form.customerPhone}
            onChange={(e) =>
              setForm({ ...form, customerPhone: e.target.value })
            }
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Delivery Address *
          </label>
          <textarea
            required
            rows={3}
            value={form.customerAddress}
            onChange={(e) =>
              setForm({ ...form, customerAddress: e.target.value })
            }
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Payment Method *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  paymentMethod: 0,
                  walletNumber: "",
                })
              }
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                form.paymentMethod === 0
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              InstaPay
            </button>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  paymentMethod: 1,
                  instaPayHandle: "",
                })
              }
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                form.paymentMethod === 1
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              Wallet
            </button>
          </div>
        </div>

        {form.paymentMethod === 0 && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Your InstaPay Handle
            </label>
            <input
              placeholder="example@instapay"
              value={form.instaPayHandle}
              onChange={(e) =>
                setForm({ ...form, instaPayHandle: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}

        {form.paymentMethod === 1 && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Your Wallet Number
            </label>
            <input
              placeholder="01xxxxxxxxx"
              value={form.walletNumber}
              onChange={(e) =>
                setForm({ ...form, walletNumber: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{totalPrice()} EGP</span>
          </div>
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="w-full rounded-lg bg-primary py-3 font-heading font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {isPending ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}