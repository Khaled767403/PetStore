using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Dtos;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Public;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly ICatalogService _catalog;

    public ProductsController(ICatalogService catalog) => _catalog = catalog;

    [HttpGet]
    public async Task<IActionResult> Get(
    [FromQuery] string? q,
    [FromQuery] int? animalTypeId,
    [FromQuery] int? animalCategoryId,
    [FromQuery] int? productTypeCategoryId,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 12)
    {
        var data = await _catalog.GetProductsAsync(q, animalTypeId, animalCategoryId, productTypeCategoryId, page, pageSize);
        return Ok(data);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _catalog.GetProductAsync(id);
        return p is null ? NotFound() : Ok(p);
    }

    [HttpPost("{id:int}/rate")]
    public async Task<IActionResult> Rate(int id, [FromBody] RateProductRequest req)
    {
        var ip =
            HttpContext.Connection.RemoteIpAddress?.ToString()
            ?? Request.Headers["X-Forwarded-For"].FirstOrDefault()
            ?? "unknown";

        var result = await _catalog.RateAsync(id, req.Stars, ip);

        if (!result.Success)
            return BadRequest(new { message = result.ErrorMessage });

        return Ok();
    }

    [HttpGet("{id:int}/related")]
    public async Task<IActionResult> Related(int id, [FromQuery] int take = 8)
    {
        var data = await _catalog.GetRelatedProductsAsync(id, take);
        return Ok(data);
    }
}