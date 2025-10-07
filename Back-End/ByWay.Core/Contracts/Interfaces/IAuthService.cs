using ByWay.Core.DTOs.AuthDto;
using ByWay.Core.Entities;

namespace ByWay.Core.Contracts.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        string GenerateJwtToken(ApplicationUser user);
        Task<string> GenerateJwtTokenAsync(ApplicationUser user);
    }
}
