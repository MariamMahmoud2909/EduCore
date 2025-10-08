using System.ComponentModel.DataAnnotations;

namespace ByWay.Core.DTOs.Payment
{
    public class ProcessPaymentDto
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public string Currency { get; set; } = "USD";

        [Required]
        public string PaymentMethod { get; set; } // CreditCard, PayPal

        // Credit Card Info
        public string CardNumber { get; set; }
        public string CardName { get; set; }
        public string ExpiryMonth { get; set; }
        public string ExpiryYear { get; set; }
        public string Cvv { get; set; }

        // PayPal Info
        public string PaypalEmail { get; set; }
    }
}