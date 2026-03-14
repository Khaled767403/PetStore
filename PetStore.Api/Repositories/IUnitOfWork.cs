using PetStore.Api.Models;

namespace PetStore.Api.Repositories;

public interface IUnitOfWork
{
    IGenericRepository<AnimalType> AnimalTypes { get; }
    IGenericRepository<AnimalCategory> AnimalCategories { get; }
    IGenericRepository<ProductTypeCategory> ProductTypeCategories { get; }

    IGenericRepository<Product> Products { get; }
    IGenericRepository<ProductImage> ProductImages { get; }

    IGenericRepository<ProductAnimalType> ProductAnimalTypes { get; }
    IGenericRepository<ProductAnimalCategory> ProductAnimalCategories { get; }
    IGenericRepository<ProductTypeAssignment> ProductTypeAssignments { get; }

    IGenericRepository<Order> Orders { get; }
    IGenericRepository<OrderItem> OrderItems { get; }

    IGenericRepository<StoreSettings> StoreSettings { get; }
    IGenericRepository<AdminUser> AdminUsers { get; }

    IGenericRepository<ProductRating> ProductRatings { get; }

    Task<int> SaveChangesAsync();
}