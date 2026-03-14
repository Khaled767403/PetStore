using PetStore.Api.Models.Enums;

namespace PetStore.Api.Models;

// Models/Product.cs
public class Product
{
    public int Id { get; set; }

    public required string Title { get; set; }
    public string? Description { get; set; }

    public decimal Price { get; set; }

    // NEW: nullable discount percent (0..100)
    public decimal? DiscountPercent { get; set; } = null;

    public int QuantityOnHand { get; set; }
    public ProductStatus Status { get; set; } = ProductStatus.Draft;

    public int RatingCount { get; set; } = 0;
    public int RatingSum { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<ProductImage> Images { get; set; } = new();

    public List<ProductAnimalType> AnimalTypes { get; set; } = new();
    public List<ProductAnimalCategory> AnimalCategories { get; set; } = new();
    public List<ProductTypeAssignment> ProductTypes { get; set; } = new();
}