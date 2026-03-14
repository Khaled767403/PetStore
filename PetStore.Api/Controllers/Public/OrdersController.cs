using Microsoft.AspNetCore.Mvc;
using PetStore.Api.Dtos;
using PetStore.Api.Services;

namespace PetStore.Api.Controllers.Public;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;

    public OrdersController(IOrderService orders) => _orders = orders;

    [HttpPost]
    public async Task<IActionResult> Place([FromBody] PlaceOrderRequest req)
    {
        var res = await _orders.PlaceOrderAsync(req);
        return res is null ? BadRequest("Invalid order") : Ok(res);
    }
}