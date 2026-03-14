using Microsoft.EntityFrameworkCore;
using PetStore.Api.Dtos;
using PetStore.Api.Models.Enums;
using PetStore.Api.Repositories;

namespace PetStore.Api.Services
{
    // Services/CatalogService .cs
    public class CatalogService : ICatalogService
    {
        private readonly IUnitOfWork _uow;
        private readonly IOfferService _offers;

        public CatalogService(IUnitOfWork uow, IOfferService offers)
        {
            _uow = uow;
            _offers = offers;
        }

        public async Task<PagedResult<ProductListItemDto>> GetProductsAsync(
            string? q, int? animalTypeId, int? animalCategoryId, int? productTypeCategoryId,
            int page, int pageSize)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 50);

            var query = _uow.Products.Query()
                .AsNoTracking()
                .Include(p => p.Images)
                .Include(p => p.AnimalTypes)
                .Include(p => p.AnimalCategories)
                .Include(p => p.ProductTypes)
                .Where(p => p.Status == ProductStatus.Active);

            if (!string.IsNullOrWhiteSpace(q))
            {
                q = q.Trim();
                query = query.Where(p => p.Title.Contains(q) || (p.Description != null && p.Description.Contains(q)));
            }

            if (animalTypeId.HasValue)
                query = query.Where(p => p.AnimalTypes.Any(x => x.AnimalTypeId == animalTypeId.Value));

            if (animalCategoryId.HasValue)
                query = query.Where(p => p.AnimalCategories.Any(x => x.AnimalCategoryId == animalCategoryId.Value));

            if (productTypeCategoryId.HasValue)
                query = query.Where(p => p.ProductTypes.Any(x => x.ProductTypeCategoryId == productTypeCategoryId.Value));

            var totalCount = await query.CountAsync();

            var products = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var productIds = products.Select(p => p.Id).ToList();

            // Build maps
            var mapType = products.ToDictionary(p => p.Id, p => p.AnimalTypes.Select(x => x.AnimalTypeId).Distinct().ToList());
            var mapCat = products.ToDictionary(p => p.Id, p => p.AnimalCategories.Select(x => x.AnimalCategoryId).Distinct().ToList());
            var mapPT = products.ToDictionary(p => p.Id, p => p.ProductTypes.Select(x => x.ProductTypeCategoryId).Distinct().ToList());

            var effectiveOffers = await _offers.GetEffectiveOffersForProductsAsync(productIds, mapType, mapCat, mapPT);

            var items = products.Select(p =>
            {
                var avg = p.RatingCount == 0 ? 0 : (double)p.RatingSum / p.RatingCount;
                var main = p.Images.OrderBy(i => i.SortOrder).FirstOrDefault(i => i.IsMain) ??
                           p.Images.OrderBy(i => i.SortOrder).FirstOrDefault();

                // Product-level discount overrides everything
                decimal percent;
                string source;

                if (p.DiscountPercent.HasValue && p.DiscountPercent.Value > 0)
                {
                    percent = p.DiscountPercent.Value;
                    source = "Product";
                }
                else
                {
                    var offer = effectiveOffers.TryGetValue(p.Id, out var r) ? r : new OfferResult(0, "None");
                    percent = offer.Percent;
                    source = offer.Source;
                }

                var finalPrice = _offers.ApplyDiscount(p.Price, percent);

                return new ProductListItemDto(
                    p.Id,
                    p.Title,
                    p.Price,
                    finalPrice,
                    percent,
                    p.QuantityOnHand,
                    p.Status,
                    avg,
                    p.RatingCount,
                    main?.Url,
                    source
                );
            }).ToList();

            return new PagedResult<ProductListItemDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<ProductDetailsDto?> GetProductAsync(int id)
        {
            var p = await _uow.Products.Query()
                .AsNoTracking()
                .Include(x => x.Images)
                .Include(x => x.AnimalTypes)
                .Include(x => x.AnimalCategories)
                .Include(x => x.ProductTypes)
                .FirstOrDefaultAsync(x => x.Id == id && x.Status == ProductStatus.Active);

            if (p is null) return null;

            var avg = p.RatingCount == 0 ? 0 : (double)p.RatingSum / p.RatingCount;

            // compute effective offer
            var pidList = new List<int> { p.Id };
            var mapType = new Dictionary<int, List<int>> { [p.Id] = p.AnimalTypes.Select(x => x.AnimalTypeId).Distinct().ToList() };
            var mapCat = new Dictionary<int, List<int>> { [p.Id] = p.AnimalCategories.Select(x => x.AnimalCategoryId).Distinct().ToList() };
            var mapPT = new Dictionary<int, List<int>> { [p.Id] = p.ProductTypes.Select(x => x.ProductTypeCategoryId).Distinct().ToList() };

            var effectiveOffers = await _offers.GetEffectiveOffersForProductsAsync(pidList, mapType, mapCat, mapPT);

            decimal percent;
            string source;

            if (p.DiscountPercent.HasValue && p.DiscountPercent.Value > 0)
            {
                percent = p.DiscountPercent.Value;
                source = "Product";
            }
            else
            {
                var offer = effectiveOffers.TryGetValue(p.Id, out var r) ? r : new OfferResult(0, "None");
                percent = offer.Percent;
                source = offer.Source;
            }

            var finalPrice = _offers.ApplyDiscount(p.Price, percent);

            return new ProductDetailsDto(
                p.Id,
                p.Title,
                p.Description,
                p.Price,
                finalPrice,
                percent,
                p.QuantityOnHand,
                p.Status,
                avg,
                p.RatingCount,
                p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).ToList(),
                p.AnimalTypes.Select(x => x.AnimalTypeId).ToList(),
                p.AnimalCategories.Select(x => x.AnimalCategoryId).ToList(),
                p.ProductTypes.Select(x => x.ProductTypeCategoryId).ToList(),
                source
            );
        }

        public async Task<(bool Success, string? ErrorMessage)> RateAsync(int productId, int stars, string ipAddress)
        {
            if (stars < 1 || stars > 5)
                return (false, "Stars must be between 1 and 5.");

            if (string.IsNullOrWhiteSpace(ipAddress))
                return (false, "Invalid client IP.");

            var p = await _uow.Products.GetByIdAsync(productId);
            if (p is null || p.Status != ProductStatus.Active)
                return (false, "Product not found.");

            var alreadyRated = await _uow.ProductRatings.AnyAsync(x =>
                x.ProductId == productId && x.IpAddress == ipAddress);

            if (alreadyRated)
                return (false, "This IP address has already rated this product.");

            await _uow.ProductRatings.AddAsync(new Models.ProductRating
            {
                ProductId = productId,
                IpAddress = ipAddress,
                Stars = stars,
                CreatedAt = DateTime.UtcNow
            });

            p.RatingCount += 1;
            p.RatingSum += stars;
            p.UpdatedAt = DateTime.UtcNow;

            _uow.Products.Update(p);
            await _uow.SaveChangesAsync();

            return (true, null);
        }

        public async Task<List<ProductListItemDto>> GetRelatedProductsAsync(int productId, int take)
        {
            take = Math.Clamp(take, 1, 24);

            var baseProduct = await _uow.Products.Query()
                .AsNoTracking()
                .Include(p => p.AnimalTypes)
                .Include(p => p.AnimalCategories)
                .Include(p => p.ProductTypes)
                .FirstOrDefaultAsync(p => p.Id == productId && p.Status == ProductStatus.Active);

            if (baseProduct is null) return new List<ProductListItemDto>();

            var baseAnimalTypeIds = baseProduct.AnimalTypes.Select(x => x.AnimalTypeId).Distinct().ToList();
            var baseAnimalCategoryIds = baseProduct.AnimalCategories.Select(x => x.AnimalCategoryId).Distinct().ToList();
            var baseProductTypeIds = baseProduct.ProductTypes.Select(x => x.ProductTypeCategoryId).Distinct().ToList();

            var query = _uow.Products.Query()
                .AsNoTracking()
                .Include(p => p.Images)
                .Include(p => p.AnimalTypes)
                .Include(p => p.AnimalCategories)
                .Include(p => p.ProductTypes)
                .Where(p => p.Status == ProductStatus.Active && p.Id != productId);

            // related criteria: share any type/category/product-type
            query = query.Where(p =>
                p.AnimalTypes.Any(x => baseAnimalTypeIds.Contains(x.AnimalTypeId)) ||
                p.AnimalCategories.Any(x => baseAnimalCategoryIds.Contains(x.AnimalCategoryId)) ||
                p.ProductTypes.Any(x => baseProductTypeIds.Contains(x.ProductTypeCategoryId))
            );

            var related = await query
                .OrderByDescending(p => p.CreatedAt)
                .Take(take)
                .ToListAsync();

            var productIds = related.Select(p => p.Id).ToList();

            var mapType = related.ToDictionary(p => p.Id, p => p.AnimalTypes.Select(x => x.AnimalTypeId).Distinct().ToList());
            var mapCat = related.ToDictionary(p => p.Id, p => p.AnimalCategories.Select(x => x.AnimalCategoryId).Distinct().ToList());
            var mapPT = related.ToDictionary(p => p.Id, p => p.ProductTypes.Select(x => x.ProductTypeCategoryId).Distinct().ToList());

            var effectiveOffers = await _offers.GetEffectiveOffersForProductsAsync(productIds, mapType, mapCat, mapPT);

            var items = related.Select(p =>
            {
                var avg = p.RatingCount == 0 ? 0 : (double)p.RatingSum / p.RatingCount;
                var main = p.Images.OrderBy(i => i.SortOrder).FirstOrDefault(i => i.IsMain) ??
                           p.Images.OrderBy(i => i.SortOrder).FirstOrDefault();

                decimal percent;
                string source;

                if (p.DiscountPercent.HasValue && p.DiscountPercent.Value > 0)
                {
                    percent = p.DiscountPercent.Value;
                    source = "Product";
                }
                else
                {
                    var offer = effectiveOffers.TryGetValue(p.Id, out var r) ? r : new OfferResult(0, "None");
                    percent = offer.Percent;
                    source = offer.Source;
                }

                var finalPrice = _offers.ApplyDiscount(p.Price, percent);

                return new ProductListItemDto(
                    p.Id,
                    p.Title,
                    p.Price,
                    finalPrice,
                    percent,
                    p.QuantityOnHand,
                    p.Status,
                    avg,
                    p.RatingCount,
                    main?.Url,
                    source
                );
            }).ToList();

            return items;
        }
    }
}
