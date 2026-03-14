using Microsoft.EntityFrameworkCore;
using PetStore.Api.Dtos;
using PetStore.Api.Models;
using PetStore.Api.Models.Enums;
using PetStore.Api.Repositories;

namespace PetStore.Api.Services
{
    public class AdminCatalogService : IAdminCatalogService
    {
        private readonly IUnitOfWork _uow;

        public AdminCatalogService(IUnitOfWork uow) => _uow = uow;

        public async Task<int> CreateAnimalTypeAsync(CreateAnimalTypeRequest req)
        {
            var entity = new AnimalType
            {
                Name = req.Name.Trim(),
                Slug = req.Slug.Trim().ToLowerInvariant(),
                ImageUrl = string.IsNullOrWhiteSpace(req.ImageUrl) ? null : req.ImageUrl.Trim()
            };

            await _uow.AnimalTypes.AddAsync(entity);
            await _uow.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<int> CreateAnimalCategoryAsync(CreateAnimalCategoryRequest req)
        {
            // ensure animal type exists
            if (!await _uow.AnimalTypes.AnyAsync(x => x.Id == req.AnimalTypeId))
                throw new Exception("AnimalType not found");

            if (req.ParentId.HasValue && !await _uow.AnimalCategories.AnyAsync(x => x.Id == req.ParentId.Value))
                throw new Exception("Parent category not found");

            var entity = new AnimalCategory
            {
                AnimalTypeId = req.AnimalTypeId,
                ParentId = req.ParentId,
                Name = req.Name.Trim(),
                Slug = req.Slug.Trim().ToLowerInvariant(),
                SortOrder = req.SortOrder
            };

            await _uow.AnimalCategories.AddAsync(entity);
            await _uow.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<int> CreateProductTypeCategoryAsync(CreateProductTypeCategoryRequest req)
        {
            if (req.ParentId.HasValue && !await _uow.ProductTypeCategories.AnyAsync(x => x.Id == req.ParentId.Value))
                throw new Exception("Parent type category not found");

            var entity = new ProductTypeCategory
            {
                ParentId = req.ParentId,
                Name = req.Name.Trim(),
                Slug = req.Slug.Trim().ToLowerInvariant(),
                SortOrder = req.SortOrder
            };

            await _uow.ProductTypeCategories.AddAsync(entity);
            await _uow.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<int> CreateProductAsync(CreateProductRequest req)
        {
            var p = new Product
            {
                Title = req.Title.Trim(),
                Description = req.Description?.Trim(),
                Price = req.Price,
                DiscountPercent = (req.DiscountPercent.HasValue && req.DiscountPercent.Value > 0)
                    ? req.DiscountPercent
                    : null,
                QuantityOnHand = req.QuantityOnHand,
                Status = req.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _uow.Products.AddAsync(p);
            await _uow.SaveChangesAsync();

            await ReplaceProductLinksAsync(
                p.Id,
                req.ImageUrls,
                req.AnimalTypeIds,
                req.AnimalCategoryIds,
                req.ProductTypeCategoryIds
            );

            return p.Id;
        }

        public async Task<bool> UpdateProductAsync(int id, UpdateProductRequest req)
        {
            var p = await _uow.Products.GetByIdAsync(id);
            if (p is null) return false;

            p.Title = req.Title.Trim();
            p.Description = req.Description?.Trim();
            p.Price = req.Price;
            p.DiscountPercent = (req.DiscountPercent.HasValue && req.DiscountPercent.Value > 0)
                ? req.DiscountPercent
                : null;
            p.QuantityOnHand = req.QuantityOnHand;
            p.Status = req.Status;
            p.UpdatedAt = DateTime.UtcNow;

            _uow.Products.Update(p);
            await _uow.SaveChangesAsync();

            await ReplaceProductLinksAsync(
                id,
                req.ImageUrls,
                req.AnimalTypeIds,
                req.AnimalCategoryIds,
                req.ProductTypeCategoryIds
            );

            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var p = await _uow.Products.GetByIdAsync(id);
            if (p is null) return false;

            // safer: archive instead of delete
            p.Status = ProductStatus.Archived;
            p.UpdatedAt = DateTime.UtcNow;

            _uow.Products.Update(p);
            await _uow.SaveChangesAsync();
            return true;
        }

        private async Task ReplaceProductLinksAsync(
            int productId,
            List<string> imageUrls,
            List<int> animalTypeIds,
            List<int> animalCategoryIds,
            List<int> productTypeCategoryIds)
        {
            // Clear old links
            var oldImgs = await _uow.ProductImages.Query()
                .Where(x => x.ProductId == productId)
                .ToListAsync();
            foreach (var img in oldImgs) _uow.ProductImages.Remove(img);

            var oldAT = await _uow.ProductAnimalTypes.Query()
                .Where(x => x.ProductId == productId)
                .ToListAsync();
            foreach (var l in oldAT) _uow.ProductAnimalTypes.Remove(l);

            var oldAC = await _uow.ProductAnimalCategories.Query()
                .Where(x => x.ProductId == productId)
                .ToListAsync();
            foreach (var l in oldAC) _uow.ProductAnimalCategories.Remove(l);

            var oldPT = await _uow.ProductTypeAssignments.Query()
                .Where(x => x.ProductId == productId)
                .ToListAsync();
            foreach (var l in oldPT) _uow.ProductTypeAssignments.Remove(l);

            await _uow.SaveChangesAsync();

            // Add images
            for (int i = 0; i < imageUrls.Count; i++)
            {
                var url = imageUrls[i].Trim();
                if (string.IsNullOrWhiteSpace(url)) continue;

                await _uow.ProductImages.AddAsync(new ProductImage
                {
                    ProductId = productId,
                    Url = url,
                    SortOrder = i,
                    IsMain = (i == 0)
                });
            }

            // Add links
            foreach (var id in animalTypeIds.Distinct())
                await _uow.ProductAnimalTypes.AddAsync(new ProductAnimalType
                {
                    ProductId = productId,
                    AnimalTypeId = id
                });

            foreach (var id in animalCategoryIds.Distinct())
                await _uow.ProductAnimalCategories.AddAsync(new ProductAnimalCategory
                {
                    ProductId = productId,
                    AnimalCategoryId = id
                });

            foreach (var id in productTypeCategoryIds.Distinct())
                await _uow.ProductTypeAssignments.AddAsync(new ProductTypeAssignment
                {
                    ProductId = productId,
                    ProductTypeCategoryId = id
                });

            await _uow.SaveChangesAsync();
        }

        public async Task<List<AdminAnimalTypeDto>> GetAnimalTypesAsync()
        {
            var list = await _uow.AnimalTypes.Query()
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .ToListAsync();

            return list.Select(x => new AdminAnimalTypeDto(
                x.Id,
                x.Name,
                x.Slug,
                x.ImageUrl,
                x.IsActive
            )).ToList();
        }

        public async Task<List<AdminAnimalCategoryDto>> GetAnimalCategoriesAsync(int? animalTypeId)
        {
            var q = _uow.AnimalCategories.Query()
                .AsNoTracking()
                .AsQueryable();

            if (animalTypeId.HasValue)
                q = q.Where(x => x.AnimalTypeId == animalTypeId.Value);

            var list = await q
                .OrderBy(x => x.AnimalTypeId)
                .ThenBy(x => x.SortOrder)
                .ThenBy(x => x.Name)
                .ToListAsync();

            return list.Select(x => new AdminAnimalCategoryDto(
                x.Id,
                x.AnimalTypeId,
                x.ParentId,
                x.Name,
                x.Slug,
                x.SortOrder,
                x.IsActive
            )).ToList();
        }

        public async Task<List<AdminProductTypeCategoryDto>> GetProductTypeCategoriesAsync()
        {
            var list = await _uow.ProductTypeCategories.Query()
                .AsNoTracking()
                .OrderBy(x => x.SortOrder)
                .ThenBy(x => x.Name)
                .ToListAsync();

            return list.Select(x => new AdminProductTypeCategoryDto(
                x.Id,
                x.ParentId,
                x.Name,
                x.Slug,
                x.SortOrder,
                x.IsActive
            )).ToList();
        }
    }
}