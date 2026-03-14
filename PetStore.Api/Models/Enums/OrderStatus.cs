namespace PetStore.Api.Models.Enums
{
    public enum OrderStatus
    {
        PendingPayment = 0,
        Confirmed = 1,
        Rejected = 2,
        Cancelled = 3,
        Expired = 4
    }
}
