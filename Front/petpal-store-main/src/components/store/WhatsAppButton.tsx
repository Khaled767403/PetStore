import { MessageCircle } from "lucide-react";
import { useStoreSettings } from "@/hooks/public/useStoreSettings";

export function WhatsAppButton() {
  const { data: settings } = useStoreSettings();

  const whatsappNumber = settings?.whatsappNumber?.trim() || "";

  if (!whatsappNumber) return null;

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg hover:scale-110 transition-transform"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}