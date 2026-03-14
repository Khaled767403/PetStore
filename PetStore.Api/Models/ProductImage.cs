namespace PetStore.Api.Models;

public class ProductImage
{
    public int Id { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public required string Url { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsMain { get; set; } = false;
}