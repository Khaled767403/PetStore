namespace PetStore.Api.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order? Order { get; set; }

    public int ProductId { get; set; }

    // Snapshots
    public required string ProductTitleSnapshot { get; set; }
    public string? ProductMainImageSnapshot { get; set; }

    public decimal UnitPriceSnapshot { get; set; }
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
}