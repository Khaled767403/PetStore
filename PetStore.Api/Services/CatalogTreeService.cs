using Microsoft.EntityFrameworkCore;
using PetStore.Api.Dtos;
using PetStore.Api.Models;
using PetStore.Api.Repositories;

namespace PetStore.Api.Services;

public class CatalogTreeService : ICatalogTreeService
{
    private readonly IUnitOfWork _uow;
    public CatalogTreeService(IUnitOfWork uow) => _uow = uow;

    public async Task<CatalogTreesResponse> GetTreesAsync()
    {
        var animals = await _uow.AnimalTypes.Query()
            .AsNoTracking()
            .Where(a => a.IsActive)
            .OrderBy(a => a.Name)
            .ToListAsync();

        var allAnimalCategories = await _uow.AnimalCategories.Query()
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder).ThenBy(c => c.Name)
            .ToListAsync();

        var productTypes = await _uow.ProductTypeCategories.Query()
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder).ThenBy(x => x.Name)
            .ToListAsync();

        // Build animal category trees per animal type
        List<AnimalTreeDto> animalTrees = new();
        foreach (var animal in animals)
        {
            var catsForAnimal = allAnimalCategories
                .Where(c => c.AnimalTypeId == animal.Id)
                .ToList();

            var tree = BuildTree(
                catsForAnimal.Select(c => (c.Id, c.ParentId, c.Name, c.Slug)).ToList()
            );

            animalTrees.Add(new AnimalTreeDto(
                animal.Id,
                animal.Name,
                animal.Slug,
                animal.ImageUrl,
                tree
            ));
        }

        // Build product type tree
        var productTypeTree = BuildTree(
            productTypes.Select(x => (x.Id, x.ParentId, x.Name, x.Slug)).ToList()
        );

        return new CatalogTreesResponse(animalTrees, productTypeTree);
    }

    private static List<TreeNodeDto> BuildTree(List<(int Id, int? ParentId, string Name, string Slug)> nodes)
    {
        var dict = nodes.ToDictionary(
            n => n.Id,
            n => new TreeNodeDto(n.Id, n.Name, n.Slug, new List<TreeNodeDto>())
        );

        List<TreeNodeDto> roots = new();

        foreach (var n in nodes)
        {
            if (n.ParentId is null)
            {
                roots.Add(dict[n.Id]);
            }
            else if (dict.TryGetValue(n.ParentId.Value, out var parent))
            {
                parent.Children.Add(dict[n.Id]);
            }
            else
            {
                // Orphan => treat as root (safety)
                roots.Add(dict[n.Id]);
            }
        }

        return roots;
    }
}