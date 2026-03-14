// Dtos/AdminReadDtos.cs
namespace PetStore.Api.Dtos;

public record AdminAnimalTypeDto(int Id, string Name, string Slug, string? ImageUrl, bool IsActive); 
public record AdminAnimalCategoryDto(int Id, int AnimalTypeId, int? ParentId, string Name, string Slug, int SortOrder, bool IsActive);
public record AdminProductTypeCategoryDto(int Id, int? ParentId, string Name, string Slug, int SortOrder, bool IsActive);