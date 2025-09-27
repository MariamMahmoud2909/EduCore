using ByWay.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ByWay.Core.Entities
{
    public class Course : BaseEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string? Image { get; set; }
        public CourseLevel Level { get; set; }
        public decimal Rating { get; set; }
        public int Duration { get; set; }
        public int CategoryId { get; set; }
        public Guid InstructorId { get; set; }
        public bool IsPurchased { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual Category Category { get; set; }
        public virtual Instructor Instructor { get; set; }
        public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    }
}
