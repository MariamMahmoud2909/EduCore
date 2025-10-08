using ByWay.Core.DTOs.Payment;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResultDto> ProcessPaymentAsync(int userId, ProcessPaymentDto dto);
        Task<List<PaymentMethodDto>> GetUserPaymentMethodsAsync(int userId);
        Task<PaymentMethodDto> SavePaymentMethodAsync(int userId, SavePaymentMethodDto dto);
        Task<bool> DeletePaymentMethodAsync(int userId, int methodId);
    }
}