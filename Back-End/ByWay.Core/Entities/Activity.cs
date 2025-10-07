namespace ByWay.Core.Entities
{
    public class Activity
    {
        public int Id { get; set; }
        public string Type { get; set; } // CourseCreated, UserRegistered, OrderPlaced, etc.
        public string Description { get; set; }
        public int? UserId { get; set; }
        public ApplicationUser User { get; set; }
        public int? CourseId { get; set; }
        public Course Course { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}