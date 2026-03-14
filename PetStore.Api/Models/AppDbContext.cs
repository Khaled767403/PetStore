using Microsoft.EntityFrameworkCore;
using PetStore.Api.Models;

namespace PetStore.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<AnimalType> AnimalTypes => Set<AnimalType>();
    public DbSet<AnimalCategory> AnimalCategories => Set<AnimalCategory>();
    public DbSet<ProductTypeCategory> ProductTypeCategories => Set<ProductTypeCategory>();

    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();

    public DbSet<ProductAnimalType> ProductAnimalTypes => Set<ProductAnimalType>();
    public DbSet<ProductAnimalCategory> ProductAnimalCategories => Set<ProductAnimalCategory>();
    public DbSet<ProductTypeAssignment> ProductTypeAssignments => Set<ProductTypeAssignment>();

    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    public DbSet<StoreSettings> StoreSettings => Set<StoreSettings>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<Offer> Offers => Set<Offer>();

    public DbSet<ProductRating> ProductRatings => Set<ProductRating>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // AnimalCategory self reference
        modelBuilder.Entity<AnimalCategory>()
            .HasOne(x => x.Parent)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        // ProductTypeCategory self reference
        modelBuilder.Entity<ProductTypeCategory>()
            .HasOne(x => x.Parent)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        // ProductImage
        modelBuilder.Entity<ProductImage>()
            .HasIndex(x => new { x.ProductId, x.SortOrder });

        // Junction keys
        modelBuilder.Entity<ProductAnimalType>()
            .HasKey(x => new { x.ProductId, x.AnimalTypeId });

        modelBuilder.Entity<ProductAnimalCategory>()
            .HasKey(x => new { x.ProductId, x.AnimalCategoryId });

        modelBuilder.Entity<ProductTypeAssignment>()
            .HasKey(x => new { x.ProductId, x.ProductTypeCategoryId });

        // Slugs unique within scope
        modelBuilder.Entity<AnimalType>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<ProductTypeCategory>().HasIndex(x => x.Slug).IsUnique();

        modelBuilder.Entity<AnimalCategory>()
            .HasIndex(x => new { x.AnimalTypeId, x.Slug })
            .IsUnique();

        modelBuilder.Entity<Product>().HasIndex(x => x.Status);

        // StoreSettings single row (Id=1)
        modelBuilder.Entity<StoreSettings>().HasKey(x => x.Id);


        modelBuilder.Entity<Product>()
            .Property(x => x.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(x => x.Subtotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(x => x.Total)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(x => x.UnitPriceSnapshot)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(x => x.LineTotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Product>()
            .Property(x => x.DiscountPercent)
            .HasPrecision(5, 2);

        modelBuilder.Entity<Offer>()
            .Property(x => x.Percent)
            .HasPrecision(5, 2);

        modelBuilder.Entity<Offer>()
            .HasIndex(x => new { x.ScopeType, x.ScopeId, x.IsActive });

        // optional: prevent duplicates (one active offer per scope)
        modelBuilder.Entity<Offer>()
            .HasIndex(x => new { x.ScopeType, x.ScopeId })
            .IsUnique();

        modelBuilder.Entity<ProductRating>()
            .HasIndex(x => new { x.ProductId, x.IpAddress })
            .IsUnique();

        modelBuilder.Entity<ProductRating>()
            .Property(x => x.IpAddress)
            .HasMaxLength(100);

        base.OnModelCreating(modelBuilder);

    }
}