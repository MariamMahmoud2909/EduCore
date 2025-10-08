using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.Review;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IReviewService
    {
        Task<PagedResult<ReviewDto>> GetCourseReviewsAsync(int courseId, int page = 1, int pageSize = 10);
        Task<ReviewDto> GetReviewByIdAsync(int reviewId);
        Task<ReviewDto> CreateReviewAsync(int courseId, int userId, CreateReviewDto dto);
        Task<ReviewDto> UpdateReviewAsync(int reviewId, int userId, UpdateReviewDto dto);
        Task<bool> DeleteReviewAsync(int reviewId, int userId, bool isAdmin = false);
        Task<bool> UserHasReviewedCourseAsync(int courseId, int userId);
    }
}