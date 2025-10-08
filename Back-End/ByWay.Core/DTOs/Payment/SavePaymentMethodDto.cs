using System.ComponentModel.DataAnnotations;

namespace ByWay.Core.DTOs.Payment
{
    public class SavePaymentMethodDto
    {
        [Required]
        public string Type { get; set; } // CreditCard, PayPal

        [Required]
        public string CardNumber { get; set; }

        [Required]
        public string CardName { get; set; }

        [Required]
        public string ExpiryMonth { get; set; }

        [Required]
        public string ExpiryYear { get; set; }

        public string CardBrand { get; set; }

        public bool IsDefault { get; set; }
    }
}