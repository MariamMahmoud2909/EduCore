namespace ByWay.Core.Entities
{
    public class Cart : BaseEntity
    {
        public int UserId { get; set; }
        public int CourseId { get; set; }

        public DateTime AddedAt { get; set; }

        public virtual ApplicationUser User { get; set; }
        public virtual Course Course { get; set; }
    }
}
