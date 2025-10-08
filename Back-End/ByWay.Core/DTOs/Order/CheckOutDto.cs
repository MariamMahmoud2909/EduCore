namespace ByWay.Core.DTOs.Order
{
    public class CheckoutDto
    {
        public BillingInfoDto BillingInfo { get; set; }
        public PaymentInfoDto PaymentInfo { get; set; }
        public List<int> CourseIds { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "USD";

    }
}
