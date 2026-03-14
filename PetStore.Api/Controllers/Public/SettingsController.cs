using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Public;

[ApiController]
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _svc;

    public SettingsController(ISettingsService svc)
    {
        _svc = svc;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var data = await _svc.GetAsync();
        return Ok(data);
    }
}