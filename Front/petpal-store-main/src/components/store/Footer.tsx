import { Link } from "react-router-dom";
import { Phone, MessageCircle, CreditCard, Wallet } from "lucide-react";
import { useStoreSettings } from "@/hooks/public/useStoreSettings";

export function Footer() {
  const { data: settings, isLoading } = useStoreSettings();

  const whatsappNumber = settings?.whatsappNumber?.trim() || "";
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";

  const storeName = settings?.storeName?.trim() || "PetStore";
  const instapayHandle = settings?.instapayHandle?.trim() || "-";
  const walletNumber = settings?.walletNumber?.trim() || "-";
  const currency = settings?.currency?.trim() || "EGP";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-heading font-bold">{storeName}</h3>
            <p className="text-sm text-primary-foreground/70">
              Your one-stop shop for pet essentials, food, accessories, and
              everyday care.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link
                  to="/"
                  className="transition-colors hover:text-primary-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="transition-colors hover:text-primary-foreground"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="transition-colors hover:text-primary-foreground"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/checkout"
                  className="transition-colors hover:text-primary-foreground"
                >
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold">Payment Info</h4>
            {isLoading ? (
              <p className="text-sm text-primary-foreground/70">
                Loading settings...
              </p>
            ) : (
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 flex-shrink-0" />
                  InstaPay: {instapayHandle}
                </li>

                <li className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 flex-shrink-0" />
                  Wallet: {walletNumber}
                </li>

                <li className="flex items-center gap-2">
                  <span className="font-medium">Currency:</span>
                  {currency}
                </li>
              </ul>
            )}
          </div>

          <div>
            <h4 className="mb-4 font-heading font-semibold">Contact Info</h4>
            {isLoading ? (
              <p className="text-sm text-primary-foreground/70">
                Loading contact info...
              </p>
            ) : (
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  {whatsappNumber || "-"}
                </li>

                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  {whatsappLink ? (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-primary-foreground"
                    >
                      Chat on WhatsApp
                    </a>
                  ) : (
                    <span>-</span>
                  )}
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center text-sm text-primary-foreground/50">
          © 2026 {storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}