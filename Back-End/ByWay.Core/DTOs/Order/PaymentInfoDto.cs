namespace ByWay.Core.DTOs.Order
{
    public class PaymentInfoDto
    {
        public string PaymentMethod { get; set; } // credit_card, paypal
        public string CardNumber { get; set; }
        public string CardName { get; set; }
        public string ExpiryDate { get; set; }
        public string Cvv { get; set; }
    }
}
