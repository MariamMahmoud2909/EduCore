using ByWay.Core.Enums;

namespace ByWay.Core.Entities
{
    public class Order : BaseEntity
    {
        public string UserId { get; set; }

        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public string PaymentMethod { get; set; }
        public string? PaymentTransactionId { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Completed;
        public DateTime OrderDate { get; set; }

        public virtual ApplicationUser User { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        // Billing Information
        public string BillingFirstName { get; set; } = string.Empty;
        public string BillingLastName { get; set; } = string.Empty;
        public string BillingEmail { get; set; } = string.Empty;
        public string BillingAddress { get; set; } = string.Empty;
        public string BillingCity { get; set; } = string.Empty;
        public string BillingZipCode { get; set; } = string.Empty;

        public int CoursesCount => OrderItems?.Count ?? 0;
        public decimal SubTotal => TotalAmount - TaxAmount;
        public string BillingFullName => $"{BillingFirstName} {BillingLastName}";

    }
}
