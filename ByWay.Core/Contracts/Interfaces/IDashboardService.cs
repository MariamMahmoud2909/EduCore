using ByWay.Core.DTOs.Dashboard;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync();
    }
}
