using System.Text.RegularExpressions;

namespace PetStore.Api.Services;

public class LocalFileStorage : IFileStorage
{
    private readonly IWebHostEnvironment _env;

    public LocalFileStorage(IWebHostEnvironment env) => _env = env;

    public async Task<string> SaveImageAsync(Stream stream, string fileName, string contentType)
    {
        // basic allow list
        var allowed = new HashSet<string> { "image/jpeg", "image/png", "image/webp" };
        if (!allowed.Contains(contentType))
            throw new Exception("Unsupported image type");

        var uploadsRoot = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsRoot);

        var safeName = MakeSafeFileName(fileName);
        var ext = Path.GetExtension(safeName);
        if (string.IsNullOrWhiteSpace(ext)) ext = contentType switch
        {
            "image/png" => ".png",
            "image/webp" => ".webp",
            _ => ".jpg"
        };

        var finalName = $"{Guid.NewGuid():N}{ext}";
        var fullPath = Path.Combine(uploadsRoot, finalName);

        await using var fs = File.Create(fullPath);
        await stream.CopyToAsync(fs);

        // return public URL (static file)
        return $"/uploads/{finalName}";
    }

    private static string MakeSafeFileName(string name)
    {
        name = Path.GetFileName(name);
        return Regex.Replace(name, @"[^a-zA-Z0-9\.\-_]", "_");
    }
}