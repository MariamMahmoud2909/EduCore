namespace ByWay.Core.DTOs.Order
{
    public class CheckoutResultDto
    {
        public int OrderId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public string TransactionId { get; set; }
    }
}