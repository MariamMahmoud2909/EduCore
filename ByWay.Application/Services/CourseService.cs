using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.CourseDto;
using ByWay.Core.Entities;
using ByWay.Core.Enums;

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

        public async Task<PagedResult<CourseDto>> GetCoursesAsync(int page, int pageSize, string? search, decimal? minPrice, decimal? maxPrice, int? categoryId, CourseLevel? level)
        {
            var query = _unitOfWork.Repository<Course>().GetAllAsync()
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Title.Contains(search) || c.Description.Contains(search));
            }

            if (minPrice.HasValue)
                query = query.Where(c => c.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(c => c.Price <= maxPrice.Value);

            if (categoryId.HasValue)
                query = query.Where(c => c.CategoryId == categoryId.Value);

            if (level.HasValue)
                query = query.Where(c => c.Level == level.Value);

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var courseDtos = _mapper.Map<List<CourseDto>>(items);

            return new PagedResult<CourseDto>
            {
                Items = courseDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<CourseDto?> GetCourseByIdAsync(Guid id)
        {
            var course = await _unitOfWork.Repository<Course>().GetQueryable()
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.Id == id);

            return course == null ? null : _mapper.Map<CourseDto>(course);
        }

        public async Task<CourseDto> CreateCourseAsync(CreateCourseDto courseDto)
        {
            var course = _mapper.Map<Course>(courseDto);
            course.Id = Guid.NewGuid();
            course.CreatedAt = DateTime.UtcNow;
            course.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Courses.AddAsync(course);
            await _unitOfWork.CompleteAsync();

            return await GetCourseByIdAsync(course.Id);
        }

        public async Task<CourseDto?> UpdateCourseAsync(Guid id, CreateCourseDto courseDto)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(id);
            if (course == null || course.IsPurchased)
                return null;

            _mapper.Map(courseDto, course);
            course.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Courses.UpdateAsync(course);
            await _unitOfWork.CompleteAsync();

            return await GetCourseByIdAsync(course.Id);
        }

        public async Task<bool> DeleteCourseAsync(Guid id)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(id);
            if (course == null || course.IsPurchased)
                return false;

            await _unitOfWork.Courses.DeleteAsync(course);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<List<CourseDto>> GetTopCoursesAsync()
        {
            var courses = await _unitOfWork.Courses.GetQueryable()
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .OrderByDescending(c => c.Rating)
                .Take(6)
                .ToListAsync();

            return _mapper.Map<List<CourseDto>>(courses);
        }

        public async Task<List<CourseDto>> GetSimilarCoursesAsync(Guid courseId, int count = 4)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(courseId);
            if (course == null) return new List<CourseDto>();

            var similarCourses = await _unitOfWork.Courses.GetQueryable()
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Where(c => c.CategoryId == course.CategoryId && c.Id != courseId)
                .OrderByDescending(c => c.CreatedAt)
                .Take(count)
                .ToListAsync();

            return _mapper.Map<List<CourseDto>>(similarCourses);
        }
    }
}
