using Microsoft.EntityFrameworkCore;
using PetStore.Api.Dtos;
using PetStore.Api.Models.Enums;
using PetStore.Api.Repositories;

namespace PetStore.Api.Services
{
    public class AdminOrderService : IAdminOrderService
    {
        private readonly IUnitOfWork _uow;

        public AdminOrderService(IUnitOfWork uow) => _uow = uow;

        public async Task<PagedResult<AdminOrderDto>> GetOrdersAsync(OrderStatus? status, int page, int pageSize)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 50);

            var q = _uow.Orders.Query().AsNoTracking();

            if (status.HasValue)
                q = q.Where(o => o.Status == status.Value);

            var totalCount = await q.CountAsync();

            var list = await q
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = list.Select(o => new AdminOrderDto(
                o.Id, o.OrderNumber, o.Status, o.Total,
                o.CustomerName, o.CustomerPhone, o.CustomerAddress,
                o.CreatedAt, o.ConfirmedAt
            )).ToList();

            return new PagedResult<AdminOrderDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<bool> UpdateStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _uow.Orders.Query()
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order is null) return false;

            // Confirm => decrement stock ONCE
            if (status == OrderStatus.Confirmed && order.Status != OrderStatus.Confirmed)
            {
                var productIds = order.Items.Select(i => i.ProductId).Distinct().ToList();
                var products = await _uow.Products.Query().Where(p => productIds.Contains(p.Id)).ToListAsync();

                foreach (var item in order.Items)
                {
                    var p = products.First(x => x.Id == item.ProductId);
                    if (p.QuantityOnHand < item.Quantity)
                        throw new Exception($"Not enough stock for product {p.Id}");

                    p.QuantityOnHand -= item.Quantity;
                    p.UpdatedAt = DateTime.UtcNow;
                    _uow.Products.Update(p);
                }

                order.ConfirmedAt = DateTime.UtcNow;
            }

            order.Status = status;
            _uow.Orders.Update(order);
            await _uow.SaveChangesAsync();
            return true;
        }
        public async Task<AdminOrderDetailsDto?> GetOrderDetailsAsync(int id)
        {
            var order = await _uow.Orders.Query()
                .AsNoTracking()
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order is null) return null;

            var items = order.Items
                .OrderBy(i => i.Id)
                .Select(i => new AdminOrderItemDto(
                    i.ProductId,
                    i.ProductTitleSnapshot,
                    i.ProductMainImageSnapshot,
                    i.UnitPriceSnapshot,
                    i.Quantity,
                    i.LineTotal
                ))
                .ToList();

            return new AdminOrderDetailsDto(
                order.Id,
                order.OrderNumber,
                order.Status,
                order.PaymentMethod,
                order.Subtotal,
                order.Total,
                order.CustomerName,
                order.CustomerPhone,
                order.CustomerAddress,
                order.Notes,
                order.CreatedAt,
                order.ConfirmedAt,
                items
            );
        }
    }
}
