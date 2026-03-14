using PetStore.Api.Dtos;

namespace PetStore.Api.Services;

public interface ICatalogTreeService
{
    Task<CatalogTreesResponse> GetTreesAsync();
}