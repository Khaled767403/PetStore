using PetStore.Api.Models.Enums;

namespace PetStore.Api.Models;

public class Order
{
    public int Id { get; set; }
    public required string OrderNumber { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.PendingPayment;
    public PaymentMethod PaymentMethod { get; set; }

    public decimal Subtotal { get; set; }
    public decimal Total { get; set; }

    public required string CustomerName { get; set; }
    public required string CustomerPhone { get; set; }
    public required string CustomerAddress { get; set; }
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ConfirmedAt { get; set; }

    public List<OrderItem> Items { get; set; } = new();
}