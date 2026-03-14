// Controllers/Admin/AdminOffersController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Dtos;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Admin;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin/offers")]
public class AdminOffersController : ControllerBase
{
    private readonly IOffersAdminService _svc;
    public AdminOffersController(IOffersAdminService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] bool? active = true)
        => Ok(await _svc.GetOffersAsync(active));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOfferRequest req)
        => Ok(new { id = await _svc.CreateAsync(req) });

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateOfferRequest req)
        => await _svc.UpdateAsync(id, req) ? Ok() : NotFound();

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Disable(int id)
        => await _svc.DisableAsync(id) ? Ok() : NotFound();
}