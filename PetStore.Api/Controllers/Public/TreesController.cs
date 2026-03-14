using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Public;

[ApiController]
[Route("api/trees")]
public class TreesController : ControllerBase
{
    private readonly ICatalogTreeService _svc;
    public TreesController(ICatalogTreeService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _svc.GetTreesAsync());
}