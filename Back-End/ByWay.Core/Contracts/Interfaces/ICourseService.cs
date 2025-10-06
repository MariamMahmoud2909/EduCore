using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.Course;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface ICourseService
    {
        Task<PagedResult<CourseDto>> GetCoursesAsync(CourseFilterParams filterParams);
        Task<CourseDto?> GetCourseByIdAsync(int id);
        Task<CourseDto> CreateCourseAsync(CreateCourseDto courseDto);
        Task<CourseDto?> UpdateCourseAsync(int id, CreateCourseDto courseDto);
        Task<bool> DeleteCourseAsync(int id);
        Task<List<CourseDto>> GetTopCoursesAsync(int count = 6);
        Task<List<CourseDto>> GetSimilarCoursesAsync(int courseId, int count = 4);
    }
}
