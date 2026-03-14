using PetStore.Api.Models;
using PetStore.Api.Models.Enums;

namespace PetStore.Api.Dtos;

public record CartItemRequest(int ProductId, int Quantity);

public record PlaceOrderRequest(
    string CustomerName,
    string CustomerPhone,
    string CustomerAddress,
    string? Notes,
    PaymentMethod PaymentMethod,
    List<CartItemRequest> Items
);

public record PlaceOrderResponse(
    string OrderNumber,
    OrderStatus Status,
    decimal Total,
    string Currency,
    string PaymentInstructions,
    string WhatsAppUrl
);

public record AdminOrderDto(
    int Id,
    string OrderNumber,
    OrderStatus Status,
    decimal Total,
    string CustomerName,
    string CustomerPhone,
    string CustomerAddress,
    DateTime CreatedAt,
    DateTime? ConfirmedAt
);

public record UpdateOrderStatusRequest(OrderStatus Status);