// Services/AdminProductsService.cs
using Microsoft.EntityFrameworkCore;
using PetStore.Api.Dtos;
using PetStore.Api.Models;
using PetStore.Api.Models.Enums;
using PetStore.Api.Repositories;

namespace PetStore.Api.Services;

public class AdminProductsService : IAdminProductsService
{
    private readonly IUnitOfWork _uow;
    private readonly IOfferService _offers;

    public AdminProductsService(IUnitOfWork uow, IOfferService offers)
    {
        _uow = uow;
        _offers = offers;
    }

    public async Task<PagedResult<ProductListItemDto>> GetProductsAsync(
    string? q,
    ProductStatus? status,
    bool offersFirst,
    int page,
    int pageSize)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 50);

        IQueryable<Product> query = _uow.Products.Query()
            .AsNoTracking()
            .Include(p => p.Images)
            .Include(p => p.AnimalTypes)
            .Include(p => p.AnimalCategories)
            .Include(p => p.ProductTypes);

        if (!string.IsNullOrWhiteSpace(q))
        {
            q = q.Trim();
            query = query.Where(p =>
                p.Title.Contains(q) ||
                (p.Description != null && p.Description.Contains(q)));
        }

        if (status.HasValue)
            query = query.Where(p => p.Status == status.Value);

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderByDescending(p => p.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var productIds = products.Select(p => p.Id).ToList();

        var mapType = products.ToDictionary(
            p => p.Id,
            p => p.AnimalTypes.Select(x => x.AnimalTypeId).Distinct().ToList());

        var mapCat = products.ToDictionary(
            p => p.Id,
            p => p.AnimalCategories.Select(x => x.AnimalCategoryId).Distinct().ToList());

        var mapPT = products.ToDictionary(
            p => p.Id,
            p => p.ProductTypes.Select(x => x.ProductTypeCategoryId).Distinct().ToList());

        var effectiveOffers = await _offers.GetEffectiveOffersForProductsAsync(
            productIds, mapType, mapCat, mapPT);

        var items = products.Select(p =>
        {
            var avg = p.RatingCount == 0 ? 0 : (double)p.RatingSum / p.RatingCount;

            var main = p.Images.OrderBy(i => i.SortOrder).FirstOrDefault(i => i.IsMain)
                       ?? p.Images.OrderBy(i => i.SortOrder).FirstOrDefault();

            decimal percent;
            string source;

            if (p.DiscountPercent.HasValue && p.DiscountPercent.Value > 0)
            {
                percent = p.DiscountPercent.Value;
                source = "Product";
            }
            else
            {
                var offer = effectiveOffers.TryGetValue(p.Id, out var r)
                    ? r
                    : new OfferResult(0, "None");

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

        if (offersFirst)
        {
            items = items
                .OrderByDescending(x => x.DiscountPercent > 0)
                .ThenByDescending(x => x.Id)
                .ToList();
        }

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
        // allow admin to see Draft/Archived too
        var p = await _uow.Products.Query()
            .AsNoTracking()
            .Include(x => x.Images)
            .Include(x => x.AnimalTypes)
            .Include(x => x.AnimalCategories)
            .Include(x => x.ProductTypes)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (p is null) return null;

        var avg = p.RatingCount == 0 ? 0 : (double)p.RatingSum / p.RatingCount;

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
            p.Id, p.Title, p.Description,
            p.Price, finalPrice, percent,
            p.QuantityOnHand, p.Status,
            avg, p.RatingCount,
            p.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).ToList(),
            p.AnimalTypes.Select(x => x.AnimalTypeId).ToList(),
            p.AnimalCategories.Select(x => x.AnimalCategoryId).ToList(),
            p.ProductTypes.Select(x => x.ProductTypeCategoryId).ToList(),
            source
        );
    }
}