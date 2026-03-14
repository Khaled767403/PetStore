namespace PetStore.Api.Dtos;

public record StoreSettingsDto(
    string StoreName,
    string WhatsAppNumber,
    string WhatsAppTemplate,
    string InstaPayHandle,
    string WalletNumber,
    string Currency
);

public record UpdateStoreSettingsRequest(
    string StoreName,
    string WhatsAppNumber,
    string WhatsAppTemplate,
    string InstaPayHandle,
    string WalletNumber,
    string Currency
);