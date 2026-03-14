// Dtos/OfferDtos.cs
using PetStore.Api.Models;

namespace PetStore.Api.Dtos;

public record CreateOfferRequest(
    OfferScopeType ScopeType,
    int ScopeId,
    decimal Percent,
    DateTime? StartAt,
    DateTime? EndAt,
    bool IsActive
);

public record OfferDto(
    int Id,
    OfferScopeType ScopeType,
    int ScopeId,
    decimal Percent,
    bool IsActive,
    DateTime? StartAt,
    DateTime? EndAt,
    DateTime CreatedAt
);