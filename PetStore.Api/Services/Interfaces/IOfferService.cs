// Services/Interfaces/IOfferService.cs
using PetStore.Api.Models;

namespace PetStore.Api.Services;

public record OfferResult(decimal Percent, string Source);

public interface IOfferService
{
    Task<Dictionary<int, OfferResult>> GetEffectiveOffersForProductsAsync(
        List<int> productIds,
        Dictionary<int, List<int>> productAnimalTypeIds,
        Dictionary<int, List<int>> productAnimalCategoryIds,
        Dictionary<int, List<int>> productProductTypeIds);

    decimal ApplyDiscount(decimal originalPrice, decimal percent);
}