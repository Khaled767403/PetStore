using PetStore.Api.Data;
using PetStore.Api.Models;

namespace PetStore.Api.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;

    public UnitOfWork(AppDbContext db)
    {
        _db = db;

        AnimalTypes = new GenericRepository<AnimalType>(db);
        AnimalCategories = new GenericRepository<AnimalCategory>(db);
        ProductTypeCategories = new GenericRepository<ProductTypeCategory>(db);

        Products = new GenericRepository<Product>(db);
        ProductImages = new GenericRepository<ProductImage>(db);

        ProductAnimalTypes = new GenericRepository<ProductAnimalType>(db);
        ProductAnimalCategories = new GenericRepository<ProductAnimalCategory>(db);
        ProductTypeAssignments = new GenericRepository<ProductTypeAssignment>(db);

        Orders = new GenericRepository<Order>(db);
        OrderItems = new GenericRepository<OrderItem>(db);

        StoreSettings = new GenericRepository<StoreSettings>(db);
        AdminUsers = new GenericRepository<AdminUser>(db);

        ProductRatings = new GenericRepository<ProductRating>(db);
    }

    public IGenericRepository<AnimalType> AnimalTypes { get; }
    public IGenericRepository<AnimalCategory> AnimalCategories { get; }
    public IGenericRepository<ProductTypeCategory> ProductTypeCategories { get; }

    public IGenericRepository<Product> Products { get; }
    public IGenericRepository<ProductImage> ProductImages { get; }

    public IGenericRepository<ProductAnimalType> ProductAnimalTypes { get; }
    public IGenericRepository<ProductAnimalCategory> ProductAnimalCategories { get; }
    public IGenericRepository<ProductTypeAssignment> ProductTypeAssignments { get; }

    public IGenericRepository<Order> Orders { get; }
    public IGenericRepository<OrderItem> OrderItems { get; }

    public IGenericRepository<StoreSettings> StoreSettings { get; }
    public IGenericRepository<AdminUser> AdminUsers { get; }

    public IGenericRepository<ProductRating> ProductRatings { get; }

    public Task<int> SaveChangesAsync() => _db.SaveChangesAsync();
}