using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.AuthDto;
using ByWay.Core.DTOs.User;
using ByWay.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthController(
            IAuthService authService,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration)
        {
            _authService = authService;
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
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

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { result = "Logged out" });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            var roles = await _userManager.GetRolesAsync(user);
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsAdmin = roles.Contains("Admin"),
                CreatedAt = user.CreatedAt
            };
        }

        // Social Authentication Methods
        [HttpGet("external-login/{provider}")]
        public IActionResult ExternalLogin(string provider)
        {
            // Validate provider
            var validProviders = new[] { "Google", "Facebook", "GitHub" };
            if (!validProviders.Contains(provider))
                return BadRequest("Invalid provider");

            var redirectUrl = Url.Action("ExternalLoginCallback", "Auth", null, Request.Scheme);
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);

            return Challenge(properties, provider);
        }

        [HttpGet("external-callback")]
        public async Task<IActionResult> ExternalLoginCallback()
        {
            // Get external login info
            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return Redirect($"{_configuration["FrontendUrl"]}/auth/callback?error=external_login_failed");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey,
                isPersistent: false, bypassTwoFactor: true);

            if (result.Succeeded)
            {
                // User already exists and is signed in
                var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
                var token = await _authService.GenerateJwtTokenAsync(user);
                return Redirect($"{_configuration["FrontendUrl"]}/auth/callback?token={token}");
            }

            if (result.IsLockedOut)
            {
                return Redirect($"{_configuration["FrontendUrl"]}/auth/callback?error=account_locked");
            }
            else
            {
                // If the user does not have an account, then create one
                var email = info.Principal.FindFirstValue(ClaimTypes.Email);
                var firstName = info.Principal.FindFirstValue(ClaimTypes.GivenName) ??
                               info.Principal.FindFirstValue(ClaimTypes.Name)?.Split(' ').First();
                var lastName = info.Principal.FindFirstValue(ClaimTypes.Surname) ??
                              info.Principal.FindFirstValue(ClaimTypes.Name)?.Split(' ').Last();

                if (string.IsNullOrEmpty(email))
                {
                    return Redirect($"{_configuration["FrontendUrl"]}/auth/callback?error=email_not_provided");
                }

                var user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FirstName = firstName ?? "Unknown",
                    LastName = lastName ?? "User",
                    EmailConfirmed = true, // Social logins typically confirm email
                    CreatedAt = DateTime.UtcNow
                };

                var createResult = await _userManager.CreateAsync(user);
                if (createResult.Succeeded)
                {
                    // Add user to default role
                    await _userManager.AddToRoleAsync(user, "Student");

                    // Add the external login
                    await _userManager.AddLoginAsync(user, info);
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    var token = await _authService.GenerateJwtTokenAsync(user);
                    return Redirect($"{_configuration["FrontendUrl"]}/auth/callback?token={token}");
                }
                else
                {
                    // User might already exist but without this external login
                    var existingUser = await _userManager.FindByEmailAsync(email);
                    if (existingUser != null)
                    {
                        // Add the external login to existing account
                        var addLoginResult = await _userManager.AddLoginAsync(existingUser, info);
                        if (addLoginResult.Succeeded)
                        {
                            await _signInManager.SignInAsync(existingUser, isPersistent: false);
                            var token = await _authService.GenerateJwtTokenAsync(existingUser);
                            return Redirect($"{_configuration["FrontendUrl"]}/auth/callback?token={token}");
                        }
                    }

                    return Redirect($"{_configuration["FrontendUrl"]}/auth/callback?error=registration_failed");
                }
            }
        }

        // Get external authentication schemes
        [HttpGet("external-providers")]
        public IActionResult GetExternalProviders()
        {
            var providers = _signInManager.GetExternalAuthenticationSchemesAsync().Result;
            return Ok(providers.Select(p => new { p.Name, p.DisplayName }));
        }
    }
}