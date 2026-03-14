// Models/Offer.cs
namespace PetStore.Api.Models;

public enum OfferScopeType
{
    AnimalType = 1,
    AnimalCategory = 2,
    ProductTypeCategory = 3
}

public class Offer
{
    public int Id { get; set; }

    public OfferScopeType ScopeType { get; set; }
    public int ScopeId { get; set; }          // e.g., AnimalTypeId or AnimalCategoryId ...

    public decimal Percent { get; set; }      // 0..100
    public bool IsActive { get; set; } = true;

    public DateTime? StartAt { get; set; }    // optional
    public DateTime? EndAt { get; set; }      // optional

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}