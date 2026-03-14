using PetStore.Api.Dtos;

namespace PetStore.Api.Services;

public interface ICatalogService
{
    Task<PagedResult<ProductListItemDto>> GetProductsAsync(
        string? q,
        int? animalTypeId,
        int? animalCategoryId,
        int? productTypeCategoryId,
        int page,
        int pageSize);

    Task<ProductDetailsDto?> GetProductAsync(int id);

    Task<(bool Success, string? ErrorMessage)> RateAsync(int productId, int stars, string ipAddress);

    Task<List<ProductListItemDto>> GetRelatedProductsAsync(int productId, int take);

}