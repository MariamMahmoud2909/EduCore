namespace ByWay.Core.DTOs.Dashboard
{
    public class PopularCourseDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string InstructorName { get; set; }
        public int EnrollmentsCount { get; set; }
        public decimal Revenue { get; set; }
        public decimal AverageRating { get; set; }
        public int ReviewsCount { get; set; }
    }
}