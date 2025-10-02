
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.CourseDto;
using ByWay.Core.Enums;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface ICourseService
    {
        Task<PagedResult<CourseDto>> GetCoursesAsync(int page, int pageSize, string? search, decimal? minPrice, decimal? maxPrice, int? categoryId, CourseLevel? level);
        Task<CourseDto?> GetCourseByIdAsync(Guid id);
        Task<CourseDto> CreateCourseAsync(CreateCourseDto courseDto);
        Task<CourseDto?> UpdateCourseAsync(Guid id, CreateCourseDto courseDto);
        Task<bool> DeleteCourseAsync(Guid id);
        Task<List<CourseDto>> GetTopCoursesAsync();
        Task<List<CourseDto>> GetSimilarCoursesAsync(Guid courseId, int count = 4);
    }
}
