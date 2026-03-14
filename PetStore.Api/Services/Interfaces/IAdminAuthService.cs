using PetStore.Api.Dtos;

namespace PetStore.Api.Services
{
    public interface IAdminAuthService
    {
        Task<AdminLoginResponse?> LoginAsync(AdminLoginRequest req);
    }
}
