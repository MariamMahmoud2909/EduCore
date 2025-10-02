
using ByWay.Core.Enums;

namespace ByWay.Core.DTOs.CourseDto
{
    public class CourseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string? Image { get; set; }
        public CourseLevel Level { get; set; }
        public decimal Rating { get; set; }
        public int Duration { get; set; }
        public string CategoryName { get; set; }
        public string InstructorName { get; set; }
        public bool IsPurchased { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
