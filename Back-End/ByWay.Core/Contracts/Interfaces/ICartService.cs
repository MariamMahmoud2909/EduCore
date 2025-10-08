using ByWay.Core.DTOs.Course;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface ICartService
    {
        Task<List<CourseDto>> GetCartAsync(int userId);
        Task<bool> AddToCartAsync(int userId, int courseId);
        Task<bool> RemoveFromCartAsync(int userId, int courseId);
        Task<bool> ClearCartAsync(int userId);
    }
}
