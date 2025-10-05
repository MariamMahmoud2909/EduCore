using ByWay.Core.DTOs.Order;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CheckoutAsync(CheckoutDto checkoutDto, string userId);
        Task<List<OrderDto>> GetUserOrdersAsync(string userId);
    }
}
