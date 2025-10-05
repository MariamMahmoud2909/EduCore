using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.AuthDto;
using Microsoft.AspNetCore.Mvc;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
                return Unauthorized("Invalid credentials");

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            if (registerDto.Password != registerDto.ConfirmPassword)
                return BadRequest("Passwords do not match");

            var result = await _authService.RegisterAsync(registerDto);
            if (result == null)
                return BadRequest("User already exists or registration failed");

            return Ok(result);
        }
    }
}

