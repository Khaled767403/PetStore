using PetStore.Api.Dtos;

namespace PetStore.Api.Services
{
    public interface IAdminCatalogService
    {
        Task<int> CreateAnimalTypeAsync(CreateAnimalTypeRequest req);
        Task<int> CreateAnimalCategoryAsync(CreateAnimalCategoryRequest req);
        Task<int> CreateProductTypeCategoryAsync(CreateProductTypeCategoryRequest req);

        Task<int> CreateProductAsync(CreateProductRequest req);
        Task<bool> UpdateProductAsync(int id, UpdateProductRequest req);
        Task<bool> DeleteProductAsync(int id);

        Task<List<AdminAnimalTypeDto>> GetAnimalTypesAsync();
        Task<List<AdminAnimalCategoryDto>> GetAnimalCategoriesAsync(int? animalTypeId);
        Task<List<AdminProductTypeCategoryDto>> GetProductTypeCategoriesAsync();
    }
}
