using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Dtos;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Admin;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin/catalog")]
public class AdminCatalogController : ControllerBase
{
    private readonly IAdminCatalogService _svc;

    public AdminCatalogController(IAdminCatalogService svc) => _svc = svc;

    [HttpPost("animal-types")]
    public async Task<IActionResult> CreateAnimalType([FromBody] CreateAnimalTypeRequest req)
        => Ok(new { id = await _svc.CreateAnimalTypeAsync(req) });

    [HttpPost("animal-categories")]
    public async Task<IActionResult> CreateAnimalCategory([FromBody] CreateAnimalCategoryRequest req)
        => Ok(new { id = await _svc.CreateAnimalCategoryAsync(req) });

    [HttpPost("product-type-categories")]
    public async Task<IActionResult> CreateProductTypeCategory([FromBody] CreateProductTypeCategoryRequest req)
        => Ok(new { id = await _svc.CreateProductTypeCategoryAsync(req) });

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest req)
        => Ok(new { id = await _svc.CreateProductAsync(req) });

    [HttpPut("products/{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductRequest req)
        => await _svc.UpdateProductAsync(id, req) ? Ok() : NotFound();

    [HttpDelete("products/{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
        => await _svc.DeleteProductAsync(id) ? Ok() : NotFound();

    // Controllers/Admin/AdminCatalogController.cs
    [HttpGet("animal-types")]
    public async Task<IActionResult> GetAnimalTypes()
        => Ok(await _svc.GetAnimalTypesAsync());

    [HttpGet("animal-categories")]
    public async Task<IActionResult> GetAnimalCategories([FromQuery] int? animalTypeId)
        => Ok(await _svc.GetAnimalCategoriesAsync(animalTypeId));

    [HttpGet("product-type-categories")]
    public async Task<IActionResult> GetProductTypeCategories()
        => Ok(await _svc.GetProductTypeCategoriesAsync());
}