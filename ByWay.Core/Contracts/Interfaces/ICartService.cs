using ByWay.Core.DTOs.Course;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface ICartService
    {
        Task<List<CourseDto>> GetCartAsync(string userId);
        Task<bool> AddToCartAsync(string userId, int courseId);
        Task<bool> RemoveFromCartAsync(string userId, int courseId);
        Task<bool> ClearCartAsync(string userId);
    }
}
