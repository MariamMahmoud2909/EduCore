using ByWay.Core.Contracts.Interfaces;

namespace ByWay.Core.Entities
{
    public class Enrollment : ITimestampEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public ApplicationUser User { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
        public int ProgressPercentage { get; set; } = 0;
        public DateTime? CompletedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsCompleted { get; set; } = false;
        public DateTime? LastAccessedAt { get; set; }
    }
}