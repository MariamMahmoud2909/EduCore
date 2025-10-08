using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.Order;
using ByWay.Core.Enums;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto dto);
        Task<CheckoutResultDto> CheckoutAsync(int userId, CheckoutDto dto);
        Task<PagedResult<OrderDto>> GetAllOrdersAsync(int page, int pageSize);
        Task<OrderDto> GetOrderByIdAsync(int orderId);
        Task<List<OrderDto>> GetUserOrdersAsync(int userId);
        Task<OrderDto> UpdateOrderStatusAsync(int orderId, OrderStatus status);
    }
}