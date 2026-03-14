using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Dtos;
using PetStore.Api.Models;
using PetStore.Api.Models.Enums;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Admin;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin/orders")]
public class AdminOrdersController : ControllerBase
{
    private readonly IAdminOrderService _svc;

    public AdminOrdersController(IAdminOrderService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] OrderStatus? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        => Ok(await _svc.GetOrdersAsync(status, page, pageSize));

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest req)
        => await _svc.UpdateStatusAsync(id, req.Status) ? Ok() : NotFound();

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var data = await _svc.GetOrderDetailsAsync(id);
        return data is null ? NotFound() : Ok(data);
    }
}