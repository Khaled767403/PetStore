namespace PetStore.Api.Models;

public class ProductTypeCategory
{
    public int Id { get; set; }

    public int? ParentId { get; set; }
    public ProductTypeCategory? Parent { get; set; }
    public List<ProductTypeCategory> Children { get; set; } = new();

    public required string Name { get; set; }
    public required string Slug { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public List<ProductTypeAssignment> ProductLinks { get; set; } = new();
}