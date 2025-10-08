namespace ByWay.Core.Entities
{
    public class OrderItem : BaseEntity
    {
        public decimal Price { get; set; } // Price at time of purchase
        public DateTime PurchasedAt { get; set; }
        
        public int CourseId { get; set; }
        public int OrderId { get; set; }

        public virtual Order Order { get; set; }
        public virtual Course Course { get; set; }
    }
}
