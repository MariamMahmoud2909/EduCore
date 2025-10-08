using ByWay.Core.DTOs.Enrollment;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IEnrollmentService
    {
        Task<EnrollmentDto> EnrollCourseAsync(int userId, int courseId);
        Task<List<EnrollmentDto>> GetUserEnrollmentsAsync(int userId);
        Task<EnrollmentProgressDto> GetEnrollmentProgressAsync(int userId, int courseId);
        Task<EnrollmentProgressDto> UpdateProgressAsync(int userId, int courseId, UpdateProgressDto dto);
        Task<bool> IsUserEnrolledAsync(int userId, int courseId);
    }
}