using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Enums;

namespace ByWay.Core.Entities
{
    public class Course : BaseEntity, ITimestampEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string? Image { get; set; }
        public CourseLevel Level { get; set; }
        public decimal Rating { get; set; }
        public int Duration { get; set; }
        public bool IsPurchased { get; set; }
        public bool IsPublished { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Guid CategoryId { get; set; }
        public Guid InstructorId { get; set; }

        public virtual Category Category { get; set; }
        public virtual Instructor Instructor { get; set; }
        public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        public string LevelName => Level switch
        {
            CourseLevel.Beginner => "Beginner",
            CourseLevel.Intermediate => "Intermediate",
            CourseLevel.Advanced => "Advanced",
            _ => "Unknown"
        };

        public bool CanBeDeleted => !IsPurchased && (OrderItems?.Count ?? 0) == 0;
        public bool CanBeModified => !IsPurchased;
        public int StudentsEnrolled => OrderItems?.Count ?? 0;
    }
}
