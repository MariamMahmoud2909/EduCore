using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.User;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IUserService
    {
        Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string search = null);
        Task<UserDto> GetUserByIdAsync(int userId);
        Task<UserDto> UpdateUserProfileAsync(int userId, UpdateUserProfileDto dto);
        Task<UserStatsDto> GetUserStatsAsync(int userId);
        Task<bool> DeleteUserAsync(int userId);
        Task<UserDto> ToggleAdminRoleAsync(int userId, bool isAdmin);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}