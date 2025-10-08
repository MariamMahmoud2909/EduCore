using ByWay.Core.DTOs.Course;
using ByWay.Core.Enums;

namespace ByWay.Core.DTOs.Order
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public List<OrderItemDto> Items { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public List<CourseDto> Courses { get; set; } = new List<CourseDto>();
    }
}
