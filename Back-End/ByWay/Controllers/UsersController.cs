using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResult<UserDto>>> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var users = await _userService.GetUsersAsync(page, pageSize, search);
            return Ok(users);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpGet("{id}/stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserStatsDto>> GetUserStats(int id)
        {
            var stats = await _userService.GetUserStatsAsync(id);

            if (stats == null)
                return NotFound();

            return Ok(stats);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var deleted = await _userService.DeleteUserAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpPut("{id}/toggle-admin")]
        public async Task<ActionResult> ToggleAdminRole(int id, [FromBody] ToggleAdminDto dto)
        {
            //var success = await _userService.ToggleAdminRoleAsync(id, dto.IsAdmin);
            //if (!success)
            //    return BadRequest("Failed to update user role");

            return Ok();
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserDto>> GetUserProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _userService.GetUserByIdAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("profile")]
        public async Task<ActionResult<UserDto>> UpdateUserProfile(UpdateUserProfileDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _userService.UpdateUserProfileAsync(userId, dto);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("change-password")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var success = await _userService.ChangePasswordAsync(userId, dto);

            if (!success)
                return BadRequest("Current password is incorrect");

            return Ok(new { message = "Password changed successfully" });
        }
    }
}