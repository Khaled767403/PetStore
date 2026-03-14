using Microsoft.EntityFrameworkCore;
using PetStore.Api.Dtos;
using PetStore.Api.Models;
using PetStore.Api.Models.Enums;
using PetStore.Api.Repositories;
using System.Text;

namespace PetStore.Api.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _uow;
        private readonly IOfferService _offers;

        public OrderService(IUnitOfWork uow, IOfferService offers)
        {
            _uow = uow;
            _offers = offers;
        }
        public async Task<PlaceOrderResponse?> PlaceOrderAsync(PlaceOrderRequest req)
        {
            if (req.Items is null || req.Items.Count == 0) return null;

            // Basic validation
            if (string.IsNullOrWhiteSpace(req.CustomerName) ||
                string.IsNullOrWhiteSpace(req.CustomerPhone) ||
                string.IsNullOrWhiteSpace(req.CustomerAddress))
                return null;

            var settings = await _uow.StoreSettings.Query().AsNoTracking().FirstAsync(x => x.Id == 1);

            var productIds = req.Items.Select(i => i.ProductId).Distinct().ToList();

            var products = await _uow.Products.Query()
                .Include(p => p.Images)
                .Include(p => p.AnimalTypes)
                .Include(p => p.AnimalCategories)
                .Include(p => p.ProductTypes)
                .Where(p => productIds.Contains(p.Id) && p.Status == ProductStatus.Active)
                .ToListAsync();

            if (products.Count != productIds.Count) return null;

            foreach (var item in req.Items)
            {
                var p = products.First(x => x.Id == item.ProductId);
                if (item.Quantity <= 0) return null;
                if (p.QuantityOnHand < item.Quantity) return null;
            }

            // build maps for offers
            var mapType = products.ToDictionary(p => p.Id, p => p.AnimalTypes.Select(x => x.AnimalTypeId).Distinct().ToList());
            var mapCat = products.ToDictionary(p => p.Id, p => p.AnimalCategories.Select(x => x.AnimalCategoryId).Distinct().ToList());
            var mapPT = products.ToDictionary(p => p.Id, p => p.ProductTypes.Select(x => x.ProductTypeCategoryId).Distinct().ToList());

            var effectiveOffers = await _offers.GetEffectiveOffersForProductsAsync(productIds, mapType, mapCat, mapPT);


            var orderNumber = GenerateOrderNumber();
            decimal subtotal = 0;

            var order = new Order
            {
                OrderNumber = orderNumber,
                Status = OrderStatus.PendingPayment,
                PaymentMethod = req.PaymentMethod,
                CustomerName = req.CustomerName.Trim(),
                CustomerPhone = req.CustomerPhone.Trim(),
                CustomerAddress = req.CustomerAddress.Trim(),
                Notes = req.Notes?.Trim()
            };

            foreach (var item in req.Items)
            {
                var p = products.First(x => x.Id == item.ProductId);

                decimal percent;
                if (p.DiscountPercent.HasValue && p.DiscountPercent.Value > 0)
                    percent = p.DiscountPercent.Value;
                else
                    percent = effectiveOffers.TryGetValue(p.Id, out var r) ? r.Percent : 0;

                var unit = _offers.ApplyDiscount(p.Price, percent);
                var line = unit * item.Quantity;
                subtotal += line;

                var main = p.Images.OrderBy(i => i.SortOrder).FirstOrDefault(i => i.IsMain) ??
                           p.Images.OrderBy(i => i.SortOrder).FirstOrDefault();

                order.Items.Add(new OrderItem
                {
                    ProductId = p.Id,
                    ProductTitleSnapshot = p.Title,
                    ProductMainImageSnapshot = main?.Url,
                    UnitPriceSnapshot = unit,
                    Quantity = item.Quantity,
                    LineTotal = line
                });
            }

            order.Subtotal = subtotal;
            order.Total = subtotal;

            await _uow.Orders.AddAsync(order);
            await _uow.SaveChangesAsync();

            var paymentInstructions = BuildPaymentInstructions(settings, req.PaymentMethod, order.Total);
            var whatsappUrl = BuildWhatsappUrl(settings, order);

            return new PlaceOrderResponse(order.OrderNumber, order.Status, order.Total, settings.Currency, paymentInstructions, whatsappUrl);
        }

        private static string GenerateOrderNumber()
        {
            // Example: PS-20260301-AB12CD
            var rand = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();
            return $"PS-{DateTime.UtcNow:yyyyMMdd}-{rand}";
        }

        private static string BuildPaymentInstructions(StoreSettings s, PaymentMethod method, decimal total)
        {
            return method switch
            {
                PaymentMethod.InstaPay => $"ادفع {total} {s.Currency} على InstaPay: {s.InstaPayHandle} ثم ابعت سكرين + كود الطلب.",
                PaymentMethod.Wallet => $"ادفع {total} {s.Currency} على المحفظة: {s.WalletNumber} ثم ابعت سكرين + كود الطلب.",
                _ => $"ادفع {total} {s.Currency} ثم ابعت سكرين + كود الطلب."
            };
        }

        private static string BuildWhatsappUrl(StoreSettings s, Order order)
        {
            var itemsText = new StringBuilder();
            foreach (var it in order.Items)
            {
                itemsText.Append($"- {it.ProductTitleSnapshot} x{it.Quantity} = {it.LineTotal}\n");
            }

            string payment = order.PaymentMethod == PaymentMethod.InstaPay ? "InstaPay" : "Wallet";

            string msg = s.WhatsAppTemplate
                .Replace("{ORDER_NO}", order.OrderNumber)
                .Replace("{NAME}", order.CustomerName)
                .Replace("{PHONE}", order.CustomerPhone)
                .Replace("{ADDRESS}", order.CustomerAddress)
                .Replace("{PAYMENT}", payment)
                .Replace("{ITEMS}", Uri.EscapeDataString(itemsText.ToString()))
                .Replace("{TOTAL}", order.Total.ToString());

            // Template already uses %0A for new lines in the default; to be safe:
            var encoded = msg;

            return $"https://wa.me/{s.WhatsAppNumber}?text={encoded}";
        }
    }
}
