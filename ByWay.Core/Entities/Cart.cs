using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ByWay.Core.Entities
{
    public class Cart : BaseEntity
    {
        public string UserId { get; set; }
        public Guid CourseId { get; set; }
        public DateTime AddedAt { get; set; }

        public virtual ApplicationUser User { get; set; }
        public virtual Course Course { get; set; }
    }
}
