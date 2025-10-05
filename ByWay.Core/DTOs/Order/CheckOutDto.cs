
namespace ByWay.Core.DTOs.Order
{
    public class CheckoutDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVV { get; set; }
        public string PaymentMethod { get; set; }
        public List<int> Courses { get; set; } = new List<int>();
        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
    }
}
