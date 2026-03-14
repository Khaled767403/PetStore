using Microsoft.EntityFrameworkCore;
using PetStore.Api.Models;
using PetStore.Api.Security;

namespace PetStore.Api.Data;

public class Seeder
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly IConfiguration _config;

    public Seeder(AppDbContext db, IPasswordHasher hasher, IConfiguration config)
    {
        _db = db;
        _hasher = hasher;
        _config = config;
    }

    public async Task SeedAsync()
    {
        if (!await _db.StoreSettings.AnyAsync())
        {
            _db.StoreSettings.Add(new StoreSettings
            {
                StoreName = "PetStore",
                WhatsAppNumber = "201204723471",
                WhatsAppTemplate =
                    "طلب جديد: {ORDER_NO}\nالاسم: {NAME}\nالموبايل: {PHONE}\nالعنوان: {ADDRESS}\nطريقة الدفع: {PAYMENT}\nالمنتجات:\n{ITEMS}\nالإجمالي: {TOTAL}",
                InstaPayHandle = "instapay-handle",
                WalletNumber = "201228202202",
                Currency = "EGP",
                UpdatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();
        }

        if (!await _db.AdminUsers.AnyAsync())
        {
            var seed = _config.GetSection("AdminSeed");
            var username = seed["Username"] ?? "admin";
            var password = seed["Password"] ?? "Admin@12345";

            var (hash, salt) = _hasher.HashPassword(password);

            _db.AdminUsers.Add(new AdminUser
            {
                Username = username,
                PasswordHash = hash,
                PasswordSalt = salt,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();
        }
    }
}