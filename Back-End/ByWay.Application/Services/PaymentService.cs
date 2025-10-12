using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Payment;
using ByWay.Core.Entities;
using ByWay.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PaymentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PaymentResultDto> ProcessPaymentAsync(int userId, ProcessPaymentDto dto)
        {
            var orders = await _unitOfWork.Repository<Order>().FindAsync(o => o.Id == dto.OrderId);
            var order = orders.FirstOrDefault();

            if (order == null)
                throw new InvalidOperationException("Order not found");

            if (order.UserId != userId)
                throw new UnauthorizedAccessException("Unauthorized");

            var payment = new Payment
            {
                OrderId = dto.OrderId,
                Amount = dto.Amount,
                Currency = dto.Currency,
                Status = PaymentStatus.Processing,
                PaymentMethod = dto.PaymentMethod,
                TransactionId = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Repository<Payment>().AddAsync(payment);

            try
            {
                // Simulate payment gateway processing
                await Task.Delay(1000);

                // Payment validation
                if (dto.PaymentMethod == "CreditCard")
                {
                    if (string.IsNullOrEmpty(dto.CardNumber) || dto.CardNumber.Length < 16)
                        throw new InvalidOperationException("Invalid card number");
                }

                payment.Status = PaymentStatus.Succeeded;
                payment.ProcessedAt = DateTime.UtcNow;

                // Update order status
                order.Status = OrderStatus.Completed;
                //order.CompletedAt = DateTime.UtcNow;

                _unitOfWork.Repository<Order>().Update(order);
                await _unitOfWork.CompleteAsync();

                return new PaymentResultDto
                {
                    PaymentId = payment.Id,
                    Success = true,
                    Status = PaymentStatus.Succeeded,
                    TransactionId = payment.TransactionId,
                    Message = "Payment processed successfully",
                    ProcessedAt = payment.ProcessedAt.Value
                };
            }
            catch (Exception ex)
            {
                payment.Status = PaymentStatus.Failed;
                await _unitOfWork.CompleteAsync();

                return new PaymentResultDto
                {
                    PaymentId = payment.Id,
                    Success = false,
                    Status = PaymentStatus.Failed,
                    Message = $"Payment failed: {ex.Message}",
                    ProcessedAt = DateTime.UtcNow
                };
            }
        }

        public async Task<List<PaymentMethodDto>> GetUserPaymentMethodsAsync(int userId)
        {
            var paymentMethods = await _unitOfWork.Repository<PaymentMethod>().FindAsync(
                pm => pm.UserId == userId,
                query => query
                    .OrderByDescending(pm => pm.IsDefault)
                    .ThenByDescending(pm => pm.CreatedAt)
            );

            return _mapper.Map<List<PaymentMethodDto>>(paymentMethods);
        }

        public async Task<PaymentMethodDto> SavePaymentMethodAsync(int userId, SavePaymentMethodDto dto)
        {
            // If setting as default, unset all other defaults
            if (dto.IsDefault)
            {
                var existingMethods = await _unitOfWork.Repository<PaymentMethod>().FindAsync(
                    pm => pm.UserId == userId && pm.IsDefault
                );

                foreach (var method in existingMethods)
                {
                    method.IsDefault = false;
                    _unitOfWork.Repository<PaymentMethod>().Update(method);
                }
            }

            var paymentMethod = _mapper.Map<PaymentMethod>(dto);
            paymentMethod.UserId = userId;
            paymentMethod.Last4Digits = dto.CardNumber.Substring(dto.CardNumber.Length - 4);
            paymentMethod.CardBrand = dto.CardBrand ?? DetectCardBrand(dto.CardNumber);
            paymentMethod.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.Repository<PaymentMethod>().AddAsync(paymentMethod);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<PaymentMethodDto>(paymentMethod);
        }

        public async Task<bool> DeletePaymentMethodAsync(int userId, int methodId)
        {
            var paymentMethods = await _unitOfWork.Repository<PaymentMethod>().FindAsync(
                pm => pm.Id == methodId && pm.UserId == userId
            );
            var method = paymentMethods.FirstOrDefault();

            if (method == null)
                return false;

            _unitOfWork.Repository<PaymentMethod>().Delete(method);
            await _unitOfWork.CompleteAsync();

            return true;
        }

        private string DetectCardBrand(string cardNumber)
        {
            if (cardNumber.StartsWith("4"))
                return "Visa";
            else if (cardNumber.StartsWith("5"))
                return "Mastercard";
            else if (cardNumber.StartsWith("3"))
                return "Amex";
            else
                return "Unknown";
        }
    }
}