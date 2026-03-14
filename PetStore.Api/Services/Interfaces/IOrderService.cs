using PetStore.Api.Dtos;

namespace PetStore.Api.Services
{
    public interface IOrderService
    {
        Task<PlaceOrderResponse?> PlaceOrderAsync(PlaceOrderRequest req);
    }
}
