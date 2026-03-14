import { api } from "@/lib/api";
import type { StoreSettings } from "@/lib/types";

type RawStoreSettings = Partial<StoreSettings> & {
  storeName?: string;
  StoreName?: string;

  whatsappNumber?: string;
  whatsAppNumber?: string;
  WhatsAppNumber?: string;
  WhatsappNumber?: string;

  whatsappTemplate?: string;
  whatsAppTemplate?: string;
  WhatsAppTemplate?: string;

  instapayHandle?: string;
  instaPayHandle?: string;
  InstaPayHandle?: string;

  walletNumber?: string;
  WalletNumber?: string;

  currency?: string;
  Currency?: string;
};

function normalizeSettings(data: RawStoreSettings | null | undefined): StoreSettings {
  return {
    storeName: data?.storeName ?? data?.StoreName ?? "PetStore",

    whatsappNumber:
      data?.whatsappNumber ??
      data?.whatsAppNumber ??
      data?.WhatsAppNumber ??
      data?.WhatsappNumber ??
      "",

    whatsappTemplate:
      data?.whatsappTemplate ??
      data?.whatsAppTemplate ??
      data?.WhatsAppTemplate ??
      "",

    instapayHandle:
      data?.instapayHandle ??
      data?.instaPayHandle ??
      data?.InstaPayHandle ??
      "",

    walletNumber:
      data?.walletNumber ??
      data?.WalletNumber ??
      "",

    currency:
      data?.currency ??
      data?.Currency ??
      "EGP",
  };
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const res = await api.get<RawStoreSettings>("/settings");
  return normalizeSettings(res.data);
}