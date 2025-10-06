using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.User;

namespace ByWay.Core.Contracts.Services
{
    public interface IUserService
    {
        Task<PagedResult<UserDto>> GetUsersAsync(UserFilterParams filterParams);
        Task<UserDto?> GetUserByIdAsync(string userId);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> ToggleAdminRoleAsync(string userId, bool isAdmin);
        Task<UserStatsDto> GetUserStatsAsync(string userId);
    }
}
