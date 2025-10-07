namespace ByWay.Core.Entities
{
    public class PaymentMethod
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public ApplicationUser User { get; set; }
        public string Type { get; set; } // CreditCard, PayPal
        public string Last4Digits { get; set; }
        public string CardBrand { get; set; } // Visa, Mastercard
        public string ExpiryMonth { get; set; }
        public string ExpiryYear { get; set; }
        public bool IsDefault { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}