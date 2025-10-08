using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("stats")]
        [AllowAnonymous]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var stats = await _dashboardService.GetStatsAsync();
            return Ok(stats);
        }

        [HttpGet("activities")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<ActivityDto>>> GetRecentActivities()
        {
            var activities = await _dashboardService.GetRecentActivitiesAsync();
            return Ok(activities);
        }

        [HttpGet("sales")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SalesReportDto>> GetSalesReport([FromQuery] string period = "month")
        {
            var report = await _dashboardService.GetSalesReportAsync(period);
            return Ok(report);
        }

        [HttpGet("popular-courses")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PopularCourseDto>>> GetPopularCourses()
        {
            var courses = await _dashboardService.GetPopularCoursesAsync();
            return Ok(courses);
        }
    }
}
