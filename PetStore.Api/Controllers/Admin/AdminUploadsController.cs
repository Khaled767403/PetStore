using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Admin;

[ApiController]
[Authorize(Policy = "AdminOnly")]
[Route("api/admin/uploads")]
public class AdminUploadsController : ControllerBase
{
    private readonly IFileStorage _storage;

    public AdminUploadsController(IFileStorage storage) => _storage = storage;

    public class UploadImageRequest
    {
        public IFormFile File { get; set; } = default!;
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(10_000_000)] // 10MB
    public async Task<IActionResult> Upload([FromForm] UploadImageRequest request)
    {
        var file = request.File;

        if (file is null || file.Length == 0)
            return BadRequest("File is required");

        await using var stream = file.OpenReadStream();
        var url = await _storage.SaveImageAsync(stream, file.FileName, file.ContentType);

        return Ok(new { url });
    }
}