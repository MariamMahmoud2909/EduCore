namespace ByWay.Core.DTOs.Payment
{
    public class PaymentMethodDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Last4Digits { get; set; }
        public string CardBrand { get; set; }
        public string ExpiryMonth { get; set; }
        public string ExpiryYear { get; set; }
        public bool IsDefault { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}