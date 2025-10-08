using ByWay.Core.DTOs.Dashboard;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync();
        Task<List<ActivityDto>> GetRecentActivitiesAsync(int count = 10);
        Task<SalesReportDto> GetSalesReportAsync(string period);
        Task<List<PopularCourseDto>> GetPopularCoursesAsync(int count = 10);
    }
}