using ByWay.Core.DTOs.Course;

namespace ByWay.Core.DTOs.Order
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime OrderDate { get; set; }
        public List<CourseDto> Courses { get; set; } = new List<CourseDto>();
    }
}
