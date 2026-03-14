// Services/Interfaces/IAdminProductsService.cs
using PetStore.Api.Dtos;
using PetStore.Api.Models.Enums;

namespace PetStore.Api.Services;

public interface IAdminProductsService
{
    Task<PagedResult<ProductListItemDto>> GetProductsAsync(string? q, ProductStatus? status, bool offersFirst, int page, int pageSize);
    Task<ProductDetailsDto?> GetProductAsync(int id);
}