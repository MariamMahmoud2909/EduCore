using ByWay.Core.Contracts.Services;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<UserDto>>> GetUsers([FromQuery] UserFilterParams filterParams)
        {
            var result = await _userService.GetUsersAsync(filterParams);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpGet("{id}/stats")]
        public async Task<ActionResult<UserStatsDto>> GetUserStats(string id)
        {
            var stats = await _userService.GetUserStatsAsync(id);
            return Ok(stats);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var deleted = await _userService.DeleteUserAsync(id);
            if (!deleted)
                return BadRequest("Cannot delete admin users");

            return NoContent();
        }

        [HttpPut("{id}/toggle-admin")]
        public async Task<ActionResult> ToggleAdminRole(string id, [FromBody] ToggleAdminDto dto)
        {
            var success = await _userService.ToggleAdminRoleAsync(id, dto.IsAdmin);
            if (!success)
                return BadRequest("Failed to update user role");

            return Ok();
        }
    }
}