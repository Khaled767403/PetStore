using PetStore.Api.Dtos;
using PetStore.Api.Models;
using PetStore.Api.Models.Enums;

namespace PetStore.Api.Services;

public interface IAdminOrderService
{
    Task<PagedResult<AdminOrderDto>> GetOrdersAsync(OrderStatus? status, int page, int pageSize);
    Task<bool> UpdateStatusAsync(int orderId, OrderStatus status);

    // Services/Interfaces/IAdminOrderService.cs
    Task<AdminOrderDetailsDto?> GetOrderDetailsAsync(int id);
}