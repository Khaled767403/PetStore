using Microsoft.EntityFrameworkCore;
using PetStore.Api.Dtos;
using PetStore.Api.Repositories;
using PetStore.Api.Security;

namespace PetStore.Api.Services
{
    public class AdminAuthService : IAdminAuthService
    {
        private readonly IUnitOfWork _uow;
        private readonly IPasswordHasher _hasher;
        private readonly IConfiguration _config;

        public AdminAuthService(IUnitOfWork uow, IPasswordHasher hasher, IConfiguration config)
        {
            _uow = uow;
            _hasher = hasher;
            _config = config;
        }

        public async Task<AdminLoginResponse?> LoginAsync(AdminLoginRequest req)
        {
            var admin = await _uow.AdminUsers.Query()
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Username == req.Username && x.IsActive);

            if (admin is null) return null;

            if (!_hasher.Verify(req.Password, admin.PasswordHash, admin.PasswordSalt))
                return null;

            var token = JwtTokenFactory.CreateAdminToken(_config, admin.Username);
            return new AdminLoginResponse(token);
        }
    }
}
