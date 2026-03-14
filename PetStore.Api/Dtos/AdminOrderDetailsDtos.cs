// Dtos/AdminOrderDetailsDtos.cs
using PetStore.Api.Models.Enums;

namespace PetStore.Api.Dtos;

public record AdminOrderItemDto(
    int ProductId,
    string ProductTitleSnapshot,
    string? ProductMainImageSnapshot,
    decimal UnitPriceSnapshot,
    int Quantity,
    decimal LineTotal
);

public record AdminOrderDetailsDto(
    int Id,
    string OrderNumber,
    OrderStatus Status,
    PaymentMethod PaymentMethod,
    decimal Subtotal,
    decimal Total,
    string CustomerName,
    string CustomerPhone,
    string CustomerAddress,
    string? Notes,
    DateTime CreatedAt,
    DateTime? ConfirmedAt,
    List<AdminOrderItemDto> Items
);