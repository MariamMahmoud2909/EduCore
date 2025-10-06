namespace ByWay.Core.DTOs.User
{
    public class UserStatsDto
    {
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public int CoursesOwned { get; set; }
        public DateTime LastLogin { get; set; }
    }
}
