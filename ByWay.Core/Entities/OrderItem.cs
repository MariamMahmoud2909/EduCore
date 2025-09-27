
namespace ByWay.Core.Entities
{
    public class OrderItem : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Guid CourseId { get; set; }
        public decimal Price { get; set; }

        public virtual Order Order { get; set; }
        public virtual Course Course { get; set; }
    }
}
