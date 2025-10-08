namespace ByWay.Core.DTOs.Dashboard
{
    public class DashboardStatsDto
    {
        public int CoursesCount { get; set; }
        public int InstructorsCount { get; set; }
        public int StudentsCount { get; set; }
        public int MonthlySubscriptions { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public int ActiveEnrollments { get; set; }
        public int CompletedCourses { get; set; }
        public decimal AverageRating { get; set; }
        public int TotalReviews { get; set; }
    }
}