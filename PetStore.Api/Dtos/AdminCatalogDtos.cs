using PetStore.Api.Models;
using PetStore.Api.Models.Enums;

namespace PetStore.Api.Dtos;

public record CreateAnimalTypeRequest(string Name, string Slug, string? ImageUrl); 
public record CreateAnimalCategoryRequest(int AnimalTypeId, int? ParentId, string Name, string Slug, int SortOrder);

public record CreateProductTypeCategoryRequest(int? ParentId, string Name, string Slug, int SortOrder);

// Dtos/AdminCatalogDtos.cs
public record CreateProductRequest(
    string Title,
    string? Description,
    decimal Price,
    decimal? DiscountPercent, // NEW
    int QuantityOnHand,
    ProductStatus Status,
    List<string> ImageUrls,
    List<int> AnimalTypeIds,
    List<int> AnimalCategoryIds,
    List<int> ProductTypeCategoryIds
);

public record UpdateProductRequest(
    string Title,
    string? Description,
    decimal Price,
    decimal? DiscountPercent, // NEW
    int QuantityOnHand,
    ProductStatus Status,
    List<string> ImageUrls,
    List<int> AnimalTypeIds,
    List<int> AnimalCategoryIds,
    List<int> ProductTypeCategoryIds
);