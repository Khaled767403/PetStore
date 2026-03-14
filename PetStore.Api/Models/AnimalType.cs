namespace PetStore.Api.Models;

public class AnimalType
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? ImageUrl { get; set; }   // NEW
    public bool IsActive { get; set; } = true;

    public List<AnimalCategory> Categories { get; set; } = new();
    public List<ProductAnimalType> ProductLinks { get; set; } = new();
}