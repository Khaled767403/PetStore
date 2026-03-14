// Services/Interfaces/IOffersAdminService.cs
using PetStore.Api.Dtos;

namespace PetStore.Api.Services;

public interface IOffersAdminService
{
    Task<List<OfferDto>> GetOffersAsync(bool? active);
    Task<int> CreateAsync(CreateOfferRequest req);
    Task<bool> UpdateAsync(int id, CreateOfferRequest req);
    Task<bool> DisableAsync(int id);
}