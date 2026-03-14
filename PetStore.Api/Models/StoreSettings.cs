namespace PetStore.Api.Models;

public class StoreSettings
{
    public int Id { get; set; }

    public string StoreName { get; set; } = "Pet Store";
    public string WhatsAppNumber { get; set; } = "201228202202"; // international format
    public string WhatsAppTemplate { get; set; } =
        "Order {ORDER_NO}%0AName: {NAME}%0APhone: {PHONE}%0AAddress: {ADDRESS}%0APayment: {PAYMENT}%0AItems:%0A{ITEMS}%0ATotal: {TOTAL}";

    public string InstaPayHandle { get; set; } = "yourInstapayHandle";
    public string WalletNumber { get; set; } = "01228202202";
    public string Currency { get; set; } = "EGP";

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}