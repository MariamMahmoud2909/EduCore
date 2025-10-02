
using ByWay.Core.Enums;

namespace ByWay.Application.DTOs.CourseDto
{
    public class CreateCourseDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string? Image { get; set; }
        public CourseLevel Level { get; set; }
        public int Duration { get; set; }
        public int CategoryId { get; set; }
        public Guid InstructorId { get; set; }
    }
}
