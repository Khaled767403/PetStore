using Microsoft.EntityFrameworkCore;
using PetStore.Api.Dtos;
using PetStore.Api.Models;
using PetStore.Api.Repositories;

namespace PetStore.Api.Services;

public class SettingsService : ISettingsService
{
    private readonly IUnitOfWork _uow;
    public SettingsService(IUnitOfWork uow) => _uow = uow;

    public async Task<StoreSettingsDto> GetAsync()
    {
        var s = await _uow.StoreSettings.Query()
            .AsNoTracking()
            .OrderBy(x => x.Id)
            .FirstAsync();

        return new StoreSettingsDto(
            s.StoreName,
            s.WhatsAppNumber,
            s.WhatsAppTemplate,
            s.InstaPayHandle,
            s.WalletNumber,
            s.Currency
        );
    }

    public async Task UpdateAsync(UpdateStoreSettingsRequest req)
    {
        var s = await _uow.StoreSettings.Query()
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        if (s is null)
        {
            s = new StoreSettings
            {
                StoreName = "PetStore",
                WhatsAppNumber = "",
                WhatsAppTemplate = "",
                InstaPayHandle = "",
                WalletNumber = "",
                Currency = "EGP",
                UpdatedAt = DateTime.UtcNow
            };

            await _uow.StoreSettings.AddAsync(s);
        }

        s.StoreName = string.IsNullOrWhiteSpace(req.StoreName) ? s.StoreName : req.StoreName.Trim();
        s.WhatsAppNumber = string.IsNullOrWhiteSpace(req.WhatsAppNumber) ? s.WhatsAppNumber : req.WhatsAppNumber.Trim();
        s.WhatsAppTemplate = string.IsNullOrWhiteSpace(req.WhatsAppTemplate) ? s.WhatsAppTemplate : req.WhatsAppTemplate.Trim();
        s.InstaPayHandle = string.IsNullOrWhiteSpace(req.InstaPayHandle) ? s.InstaPayHandle : req.InstaPayHandle.Trim();
        s.WalletNumber = string.IsNullOrWhiteSpace(req.WalletNumber) ? s.WalletNumber : req.WalletNumber.Trim();
        s.Currency = string.IsNullOrWhiteSpace(req.Currency) ? s.Currency : req.Currency.Trim();
        s.UpdatedAt = DateTime.UtcNow;

        // لو كانت موجودة أصلاً ومتعقبة من EF مش محتاج Update()
        // لكن لو حابب صراحة:
        // _uow.StoreSettings.Update(s);

        await _uow.SaveChangesAsync();
    }
}