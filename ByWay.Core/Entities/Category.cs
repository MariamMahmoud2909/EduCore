using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ByWay.Core.Entities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public string? Image { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    }
}
