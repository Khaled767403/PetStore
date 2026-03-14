using PetStore.Api.Models;
using PetStore.Api.Models.Enums;

namespace PetStore.Api.Dtos;

// Dtos/CatalogDtos.cs
public record ProductListItemDto(
    int Id,
    string Title,
    decimal OriginalPrice,
    decimal FinalPrice,
    decimal DiscountPercent,
    int QuantityOnHand,
    ProductStatus Status,
    double RatingAvg,
    int RatingCount,
    string? MainImageUrl,
    string OfferSource // "Product" | "AnimalCategory" | "ProductTypeCategory" | "AnimalType" | "None"
);

public record ProductDetailsDto(
    int Id,
    string Title,
    string? Description,
    decimal OriginalPrice,
    decimal FinalPrice,
    decimal DiscountPercent,
    int QuantityOnHand,
    ProductStatus Status,
    double RatingAvg,
    int RatingCount,
    List<string> ImageUrls,
    List<int> AnimalTypeIds,
    List<int> AnimalCategoryIds,
    List<int> ProductTypeCategoryIds,
    string OfferSource
);

public record RateProductRequest(int Stars); // 1..5