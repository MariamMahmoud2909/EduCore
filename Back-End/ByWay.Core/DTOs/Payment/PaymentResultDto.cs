using ByWay.Core.Enums;

namespace ByWay.Core.DTOs.Payment
{
    public class PaymentResultDto
    {
        public int PaymentId { get; set; }
        public bool Success { get; set; }
        public PaymentStatus Status { get; set; }
        public string TransactionId { get; set; }
        public string Message { get; set; }
        public DateTime ProcessedAt { get; set; }
    }
}