// Controllers/Admin/AdminProductsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Dtos;
using PetStore.Api.Models.Enums;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Admin;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin/products")]
public class AdminProductsController : ControllerBase
{
    private readonly IAdminProductsService _svc;
    public AdminProductsController(IAdminProductsService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? q,
        [FromQuery] ProductStatus? status,
        [FromQuery] bool offersFirst = true,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
        => Ok(await _svc.GetProductsAsync(q, status, offersFirst, page, pageSize));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _svc.GetProductAsync(id);
        return p is null ? NotFound() : Ok(p);
    }
}