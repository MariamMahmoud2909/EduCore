
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Dashboard;
using ByWay.Core.Entities;

namespace ByWay.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DashboardStatsDto> GetStatsAsync()
        {
            var courses = await _unitOfWork.Repository<Course>().GetAllAsync();
            var instructors = await _unitOfWork.Repository<Instructor>().GetAllAsync();
            var categories = await _unitOfWork.Repository<Category>().GetAllAsync();
            var orders = await _unitOfWork.Repository<Order>().GetAllAsync();

            var currentMonth = DateTime.UtcNow.Month;
            var currentYear = DateTime.UtcNow.Year;
            var monthlySubscriptions = orders.Count(o => o.OrderDate.Month == currentMonth && o.OrderDate.Year == currentYear);

            var studentsCount = orders.Select(o => o.UserId).Distinct().Count();

            return new DashboardStatsDto
            {
                CoursesCount = courses.Count,
                InstructorsCount = instructors.Count,
                CategoriesCount = categories.Count,
                StudentsCount = studentsCount,
                MonthlySubscriptions = monthlySubscriptions
            };
        }
    }
}
