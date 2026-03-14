using PetStore.Api.Dtos;

namespace PetStore.Api.Services;

public interface ISettingsService
{
    Task<StoreSettingsDto> GetAsync();
    Task UpdateAsync(UpdateStoreSettingsRequest req);
}