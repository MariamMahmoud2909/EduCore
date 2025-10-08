namespace ByWay.Core.DTOs.User
{
    public class UserStatsDto
    {
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public int CoursesOwned { get; set; }
        public DateTime LastLogin { get; set; }
        public int UserId { get; set; }
        public int EnrolledCoursesCount { get; set; }
        public int CompletedCoursesCount { get; set; }
        public int InProgressCoursesCount { get; set; }
        public int ReviewsCount { get; set; }
        public DateTime JoinedDate { get; set; }
    }
}
