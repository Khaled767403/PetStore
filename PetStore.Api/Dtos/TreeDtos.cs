namespace PetStore.Api.Dtos;

public record TreeNodeDto(
    int Id,
    string Name,
    string Slug,
    List<TreeNodeDto> Children
);

public record AnimalTreeDto(
    int Id,
    string Name,
    string Slug,
    string? ImageUrl,
    List<TreeNodeDto> Categories
);

public record CatalogTreesResponse(
    List<AnimalTreeDto> Animals,
    List<TreeNodeDto> ProductTypes
);