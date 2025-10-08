using System.ComponentModel.DataAnnotations;

namespace ByWay.Core.DTOs.Enrollment
{
    public class EnrollCourseDto
    {
        [Required]
        public int CourseId { get; set; }
    }
}