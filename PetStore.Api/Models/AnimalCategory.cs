namespace PetStore.Api.Models;

public class AnimalCategory
{
    public int Id { get; set; }

    public int AnimalTypeId { get; set; }
    public AnimalType? AnimalType { get; set; }

    public int? ParentId { get; set; }
    public AnimalCategory? Parent { get; set; }
    public List<AnimalCategory> Children { get; set; } = new();

    public required string Name { get; set; }
    public required string Slug { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public List<ProductAnimalCategory> ProductLinks { get; set; } = new();
}