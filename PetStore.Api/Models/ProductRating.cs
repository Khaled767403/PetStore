namespace PetStore.Api.Models;

public class ProductRating
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public required string IpAddress { get; set; }

    public int Stars { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}