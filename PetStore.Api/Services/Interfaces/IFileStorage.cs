namespace PetStore.Api.Services;

public interface IFileStorage
{
    Task<string> SaveImageAsync(Stream stream, string fileName, string contentType);
}