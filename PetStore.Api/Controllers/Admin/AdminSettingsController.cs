using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Dtos;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Admin;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin/settings")]
public class AdminSettingsController : ControllerBase
{
    private readonly ISettingsService _svc;
    public AdminSettingsController(ISettingsService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await _svc.GetAsync());

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateStoreSettingsRequest req)
    {
        await _svc.UpdateAsync(req);
        return Ok();
    }
}