using ByWay.Core.Contracts.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ByWay.Core.Entities
{
    public class Category : BaseEntity, ITimestampEntity
    {
        public string Name { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

        public int CoursesCount => Courses?.Count ?? 0;
    }
}
