// Services/OffersAdminService.cs
using Microsoft.EntityFrameworkCore;
using PetStore.Api.Data;
using PetStore.Api.Dtos;
using PetStore.Api.Models;

namespace PetStore.Api.Services;

public class OffersAdminService : IOffersAdminService
{
    private readonly AppDbContext _db;
    public OffersAdminService(AppDbContext db) => _db = db;

    public async Task<List<OfferDto>> GetOffersAsync(bool? active)
    {
        var q = _db.Offers.AsNoTracking().AsQueryable();
        if (active.HasValue) q = q.Where(x => x.IsActive == active.Value);

        var list = await q.OrderByDescending(x => x.CreatedAt).ToListAsync();
        return list.Select(x => new OfferDto(x.Id, x.ScopeType, x.ScopeId, x.Percent, x.IsActive, x.StartAt, x.EndAt, x.CreatedAt)).ToList();
    }

    public async Task<int> CreateAsync(CreateOfferRequest req)
    {
        if (req.Percent < 0 || req.Percent > 100) throw new Exception("Percent must be 0..100");

        var entity = new Offer
        {
            ScopeType = req.ScopeType,
            ScopeId = req.ScopeId,
            Percent = req.Percent,
            StartAt = req.StartAt,
            EndAt = req.EndAt,
            IsActive = req.IsActive
        };

        _db.Offers.Add(entity);
        await _db.SaveChangesAsync();
        return entity.Id;
    }

    public async Task<bool> UpdateAsync(int id, CreateOfferRequest req)
    {
        var entity = await _db.Offers.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return false;

        entity.ScopeType = req.ScopeType;
        entity.ScopeId = req.ScopeId;
        entity.Percent = req.Percent;
        entity.StartAt = req.StartAt;
        entity.EndAt = req.EndAt;
        entity.IsActive = req.IsActive;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DisableAsync(int id)
    {
        var entity = await _db.Offers.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return false;
        entity.IsActive = false;
        await _db.SaveChangesAsync();
        return true;
    }
}