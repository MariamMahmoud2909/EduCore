using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.Course;
using ByWay.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CourseService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResult<CourseDto>> GetCoursesAsync(CourseFilterParams filterParams)
        {
            var courses = await _unitOfWork.Repository<Course>().GetAllAsync(
                query => query
                    .Include(c => c.Category)
                    .Include(c => c.Instructor)
            );

            // Apply filters
            var filteredCourses = courses.AsQueryable();

            if (!string.IsNullOrEmpty(filterParams.Search))
            {
                filteredCourses = filteredCourses.Where(c =>
                    c.Title.Contains(filterParams.Search, StringComparison.OrdinalIgnoreCase) ||
                    c.Description.Contains(filterParams.Search, StringComparison.OrdinalIgnoreCase));
            }

            if (filterParams.MinPrice.HasValue)
                filteredCourses = filteredCourses.Where(c => c.Price >= filterParams.MinPrice.Value);

            if (filterParams.MaxPrice.HasValue)
                filteredCourses = filteredCourses.Where(c => c.Price <= filterParams.MaxPrice.Value);
           
            if (filterParams.CategoryId.HasValue)
                filteredCourses = filteredCourses.Where(c => c.CategoryId == filterParams.CategoryId.Value);

            if (filterParams.Level.HasValue)
                filteredCourses = filteredCourses.Where(c => c.Level == filterParams.Level.Value);

            var totalCount = filteredCourses.Count();

            // Apply pagination
            var pagedCourses = filteredCourses
                .OrderByDescending(c => c.CreatedAt)
                .Skip((filterParams.Page - 1) * filterParams.PageSize)
                .Take(filterParams.PageSize)
                .ToList();

            var courseDtos = _mapper.Map<List<CourseDto>>(pagedCourses);

            return new PagedResult<CourseDto>
            {
                Items = courseDtos,
                TotalCount = totalCount,
                Page = filterParams.Page,
                PageSize = filterParams.PageSize
            };
        }

        public async Task<CourseDto?> GetCourseByIdAsync(int id)
        {
            var courses = await _unitOfWork.Repository<Course>().FindAsync(
                c => c.Id == id,
                query => query.Include(c => c.Category).Include(c => c.Instructor)
            );

            var course = courses.FirstOrDefault();
            return course == null ? null : _mapper.Map<CourseDto>(course);
        }

        public async Task<CourseDto> CreateCourseAsync(CreateCourseDto courseDto)
        {
            var course = _mapper.Map<Course>(courseDto);
            course.CreatedAt = DateTime.UtcNow;
            course.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Repository<Course>().AddAsync(course);
            await _unitOfWork.CompleteAsync();

            return await GetCourseByIdAsync(course.Id) ?? throw new Exception("Failed to create course");
        }

        public async Task<CourseDto?> UpdateCourseAsync(int id, CreateCourseDto courseDto)
        {
            var courses = await _unitOfWork.Repository<Course>().FindAsync(c => c.Id == id);
            var course = courses.FirstOrDefault();

            if (course == null || course.IsPurchased)
                return null;

            _mapper.Map(courseDto, course);
            course.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Repository<Course>().Update(course);
            await _unitOfWork.CompleteAsync();

            return await GetCourseByIdAsync(course.Id);
        }

        public async Task<bool> DeleteCourseAsync(int id)
        {
            var courses = await _unitOfWork.Repository<Course>().FindAsync(c => c.Id == id);
            var course = courses.FirstOrDefault();

            if (course == null || course.IsPurchased)
                return false;

            _unitOfWork.Repository<Course>().Delete(course);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<List<CourseDto>> GetTopCoursesAsync(int count = 6)
        {
            var courses = await _unitOfWork.Repository<Course>().GetAllAsync(
                query => query
                    .Include(c => c.Category)
                    .Include(c => c.Instructor)
                    .OrderByDescending(c => c.Rating)
                    .Take(count)
            );

            return _mapper.Map<List<CourseDto>>(courses);
        }

        public async Task<List<CourseDto>> GetSimilarCoursesAsync(int courseId, int count = 4)
        {
            var targetCourses = await _unitOfWork.Repository<Course>().FindAsync(c => c.Id == courseId);
            var targetCourse = targetCourses.FirstOrDefault();

            if (targetCourse == null)
                return new List<CourseDto>();

            var similarCourses = await _unitOfWork.Repository<Course>().GetAllAsync(
                query => query
                    .Include(c => c.Category)
                    .Include(c => c.Instructor)
                    .Where(c => c.CategoryId == targetCourse.CategoryId && c.Id != courseId)
                    .OrderByDescending(c => c.CreatedAt)
                    .Take(count)
            );

            return _mapper.Map<List<CourseDto>>(similarCourses);
        }
    }
}