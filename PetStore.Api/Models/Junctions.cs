namespace PetStore.Api.Models;

public class ProductAnimalType
{
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int AnimalTypeId { get; set; }
    public AnimalType? AnimalType { get; set; }
}

public class ProductAnimalCategory
{
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int AnimalCategoryId { get; set; }
    public AnimalCategory? AnimalCategory { get; set; }
}

public class ProductTypeAssignment
{
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int ProductTypeCategoryId { get; set; }
    public ProductTypeCategory? ProductTypeCategory { get; set; }
}