// Services/OfferService.cs
using Microsoft.EntityFrameworkCore;
using PetStore.Api.Data;
using PetStore.Api.Models;

namespace PetStore.Api.Services;

public class OfferService : IOfferService
{
    private readonly AppDbContext _db;
    public OfferService(AppDbContext db) => _db = db;

    public decimal ApplyDiscount(decimal originalPrice, decimal percent)
    {
        if (percent <= 0) return originalPrice;
        if (percent > 100) percent = 100;
        var final = originalPrice * (1m - percent / 100m);
        return Math.Round(final, 2, MidpointRounding.AwayFromZero);
    }

    public async Task<Dictionary<int, OfferResult>> GetEffectiveOffersForProductsAsync(
        List<int> productIds,
        Dictionary<int, List<int>> productAnimalTypeIds,
        Dictionary<int, List<int>> productAnimalCategoryIds,
        Dictionary<int, List<int>> productProductTypeIds)
    {
        var now = DateTime.UtcNow;

        // Collect all scope ids to query offers once
        var allTypeIds = productAnimalTypeIds.Values.SelectMany(x => x).Distinct().ToList();
        var allCatIds = productAnimalCategoryIds.Values.SelectMany(x => x).Distinct().ToList();
        var allPTIds = productProductTypeIds.Values.SelectMany(x => x).Distinct().ToList();

        var offers = await _db.Offers.AsNoTracking()
            .Where(o => o.IsActive
                && (o.StartAt == null || o.StartAt <= now)
                && (o.EndAt == null || o.EndAt >= now)
                && (
                    (o.ScopeType == OfferScopeType.AnimalType && allTypeIds.Contains(o.ScopeId)) ||
                    (o.ScopeType == OfferScopeType.AnimalCategory && allCatIds.Contains(o.ScopeId)) ||
                    (o.ScopeType == OfferScopeType.ProductTypeCategory && allPTIds.Contains(o.ScopeId))
                )
            )
            .ToListAsync();

        // Index offers by scope
        var typeOffers = offers.Where(o => o.ScopeType == OfferScopeType.AnimalType)
            .GroupBy(o => o.ScopeId).ToDictionary(g => g.Key, g => g.Max(x => x.Percent));

        var catOffers = offers.Where(o => o.ScopeType == OfferScopeType.AnimalCategory)
            .GroupBy(o => o.ScopeId).ToDictionary(g => g.Key, g => g.Max(x => x.Percent));

        var ptOffers = offers.Where(o => o.ScopeType == OfferScopeType.ProductTypeCategory)
            .GroupBy(o => o.ScopeId).ToDictionary(g => g.Key, g => g.Max(x => x.Percent));

        var result = new Dictionary<int, OfferResult>();

        foreach (var pid in productIds)
        {
            decimal best = 0;
            string source = "None";

            // Category (AnimalCategory)
            if (productAnimalCategoryIds.TryGetValue(pid, out var cats))
            {
                foreach (var id in cats)
                {
                    if (catOffers.TryGetValue(id, out var p) && p > best)
                    {
                        best = p;
                        source = "AnimalCategory";
                    }
                }
            }

            // ProductTypeCategory
            if (productProductTypeIds.TryGetValue(pid, out var pts))
            {
                foreach (var id in pts)
                {
                    if (ptOffers.TryGetValue(id, out var p) && p > best)
                    {
                        best = p;
                        source = "ProductTypeCategory";
                    }
                }
            }

            // AnimalType
            if (productAnimalTypeIds.TryGetValue(pid, out var types))
            {
                foreach (var id in types)
                {
                    if (typeOffers.TryGetValue(id, out var p) && p > best)
                    {
                        best = p;
                        source = "AnimalType";
                    }
                }
            }

            result[pid] = new OfferResult(best, source);
        }

        return result;
    }
}