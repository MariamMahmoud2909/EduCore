using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Dashboard;
using ByWay.Core.Entities;
using ByWay.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DashboardService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<DashboardStatsDto> GetStatsAsync()
        {
            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            // Get all necessary data using repository pattern
            var courses = await _unitOfWork.Repository<Course>().GetAllAsync();
            var instructors = await _unitOfWork.Repository<Instructor>().GetAllAsync();
            var users = await _unitOfWork.Repository<ApplicationUser>().GetAllAsync();
            var orders = await _unitOfWork.Repository<Order>().GetAllAsync();
            var enrollments = await _unitOfWork.Repository<Enrollment>().GetAllAsync();
            var reviews = await _unitOfWork.Repository<Review>().GetAllAsync();

            // Calculate stats
            var coursesCount = courses.Count();
            var instructorsCount = instructors.Count();
            var studentsCount = enrollments.Select(e => e.UserId).Distinct().Count();

            var monthlyOrders = orders.Count(o =>o.CreatedAt >= startOfMonth && o.Status == OrderStatus.Completed);

            var totalRevenue = orders.Where(o => o.Status == OrderStatus.Completed).Sum(o => (decimal?)o.TotalAmount) ?? 0;

            var monthlyRevenue = orders.Where(o => o.CreatedAt >= startOfMonth && o.Status == OrderStatus.Completed).Sum(o => (decimal?)o.TotalAmount) ?? 0;

            var activeEnrollments = enrollments.Count(e => !e.IsCompleted);
            var completedCourses = enrollments.Count(e => e.IsCompleted);

            var averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
            var totalReviews = reviews.Count;

            return new DashboardStatsDto
            {
                CoursesCount = coursesCount,
                InstructorsCount = instructorsCount,
                StudentsCount = studentsCount,
                MonthlySubscriptions = monthlyOrders,
                TotalRevenue = totalRevenue,
                MonthlyRevenue = monthlyRevenue,
                ActiveEnrollments = activeEnrollments,
                CompletedCourses = completedCourses,
                AverageRating = (decimal)averageRating,
                TotalReviews = totalReviews
            };
        }

        public async Task<List<ActivityDto>> GetRecentActivitiesAsync(int count = 10)
        {
            var activities = await _unitOfWork.Repository<Activity>().GetAllAsync(
                query => query
                    .Include(a => a.User)
                    .Include(a => a.Course)
                    .OrderByDescending(a => a.CreatedAt)
                    .Take(count)
            );

            return _mapper.Map<List<ActivityDto>>(activities);
        }

        public async Task<SalesReportDto> GetSalesReportAsync(string period)
        {
            var now = DateTime.UtcNow;
            DateTime startDate;
            string dateFormat;

            switch (period.ToLower())
            {
                case "week":
                    startDate = now.AddDays(-7);
                    dateFormat = "MMM dd";
                    break;
                case "month":
                    startDate = new DateTime(now.Year, now.Month, 1);
                    dateFormat = "MMM dd";
                    break;
                case "year":
                    startDate = new DateTime(now.Year, 1, 1);
                    dateFormat = "MMM yyyy";
                    break;
                default:
                    startDate = new DateTime(now.Year, now.Month, 1);
                    dateFormat = "MMM dd";
                    break;
            }

            var orders = await _unitOfWork.Repository<Order>().GetAllAsync(
                query => query.Where(o => o.CreatedAt >= startDate && o.Status == OrderStatus.Completed)
            );

            var totalRevenue = orders.Sum(o => o.TotalAmount);
            var totalOrders = orders.Count;
            var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            var salesData = orders
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new SalesDataPoint
                {
                    Date = g.Key.ToString(dateFormat),
                    Revenue = g.Sum(o => o.TotalAmount),
                    Orders = g.Count()
                })
                .OrderBy(s => s.Date)
                .ToList();

            return new SalesReportDto
            {
                Period = period,
                TotalRevenue = totalRevenue,
                TotalOrders = totalOrders,
                AverageOrderValue = averageOrderValue,
                SalesData = salesData
            };
        }

        public async Task<List<PopularCourseDto>> GetPopularCoursesAsync(int count = 10)
        {
            var courses = await _unitOfWork.Repository<Course>().GetAllAsync(
                query => query
                    .Include(c => c.Instructor)
                    .Include(c => c.Enrollments)
                    .Include(c => c.Reviews)
                    .Include(c => c.OrderItems)
                    .OrderByDescending(c => c.Enrollments.Count)
                    .Take(count)
            );

            var popularCourses = courses.Select(c => new PopularCourseDto
            {
                CourseId = c.Id,
                Title = c.Title,
                InstructorName = c.Instructor.FirstName,
                EnrollmentsCount = c.Enrollments.Count,
                Revenue = c.OrderItems.Sum(oi => oi.Price),
                AverageRating = c.Reviews.Any() ? (decimal)c.Reviews.Average(r => r.Rating) : 0,
                ReviewsCount = c.Reviews.Count
            }).ToList();

            return popularCourses;
        }
    }
}