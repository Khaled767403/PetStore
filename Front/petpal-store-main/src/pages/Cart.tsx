import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
        <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-heading font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Continue Shopping
      </Link>
      <h1 className="text-2xl font-heading font-bold mb-6">Shopping Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-lg border border-border bg-card p-4">
              <img src={item.image} alt={item.title} className="h-20 w-20 rounded-md object-cover" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-sm font-bold text-primary mt-1">{item.price} EGP</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-md border border-border">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1.5 hover:bg-muted">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1.5 hover:bg-muted">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-sale hover:text-sale/80 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-foreground">{item.price * item.quantity} EGP</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-6 h-fit sticky top-24">
          <h3 className="font-heading font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{totalPrice()} EGP</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span><span className="text-primary">{totalPrice()} EGP</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-lg bg-primary py-3 text-center font-heading font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
