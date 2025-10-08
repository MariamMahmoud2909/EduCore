using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.User;
using ByWay.Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace ByWay.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper, IPasswordHasher<ApplicationUser> passwordHasher)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        public async Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string search = null)
        {
            var users = await _unitOfWork.Repository<ApplicationUser>().GetAllAsync(
                query => query.OrderByDescending(u => u.CreatedAt)
            );

            // Apply search filter
            var filteredUsers = users.AsQueryable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                filteredUsers = filteredUsers.Where(u =>
                    u.FirstName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    u.Email.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            var totalCount = filteredUsers.Count();
            var pagedUsers = filteredUsers
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var userDtos = _mapper.Map<List<UserDto>>(pagedUsers);

            return new PagedResult<UserDto>
            {
                Items = userDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            var users = await _unitOfWork.Repository<ApplicationUser>().FindAsync(u => u.Id == userId);
            var user = users.FirstOrDefault();

            return user == null ? null : _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto?> UpdateUserProfileAsync(int userId, UpdateUserProfileDto dto)
        {
            var users = await _unitOfWork.Repository<ApplicationUser>().FindAsync(u => u.Id == userId);
            var user = users.FirstOrDefault();

            if (user == null)
                return null;

            _mapper.Map(dto, user);
            _unitOfWork.Repository<ApplicationUser>().Update(user);
            await _unitOfWork.CompleteAsync();

            return await GetUserByIdAsync(userId);
        }

        public async Task<UserStatsDto?> GetUserStatsAsync(int userId)
        {
            var users = await _unitOfWork.Repository<ApplicationUser>().FindAsync(u => u.Id == userId);
            var user = users.FirstOrDefault();

            if (user == null)
                return null;

            var enrollments = await _unitOfWork.Repository<Enrollment>().FindAsync(e => e.UserId == userId);
            var orders = await _unitOfWork.Repository<Order>().FindAsync(o => o.UserId == userId);
            var reviews = await _unitOfWork.Repository<Review>().FindAsync(r => r.UserId == userId);

            return new UserStatsDto
            {
                UserId = userId,
                EnrolledCoursesCount = enrollments.Count(),
                CompletedCoursesCount = enrollments.Count(e => e.IsCompleted),
                InProgressCoursesCount = enrollments.Count(e => !e.IsCompleted),
                TotalSpent = orders.Sum(o => o.TotalAmount),
                ReviewsCount = reviews.Count(),
                JoinedDate = user.CreatedAt
            };
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            var users = await _unitOfWork.Repository<ApplicationUser>().FindAsync(u => u.Id == userId);
            var user = users.FirstOrDefault();

            if (user == null)
                return false;

            _unitOfWork.Repository<ApplicationUser>().Delete(user);
            await _unitOfWork.CompleteAsync();

            return true;
        }

        //public async Task<UserDto?> ToggleAdminRoleAsync(int userId, bool isAdmin)
        //{
        //    var users = await _unitOfWork.Repository<ApplicationUser>().FindAsync(u => u.Id == userId);
        //    var user = users.FirstOrDefault();

        //    if (user == null)
        //        return null;

        //    user.Role = isAdmin ? "Admin" : "Student";
        //    _unitOfWork.Repository<ApplicationUser>().Update(user);
        //    await _unitOfWork.CompleteAsync();

        //    return await GetUserByIdAsync(userId);
        //}

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var users = await _unitOfWork.Repository<ApplicationUser>().FindAsync(u => u.Id == userId);
            var user = users.FirstOrDefault();

            if (user == null)
                return false;

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.CurrentPassword);
            if (verificationResult != PasswordVerificationResult.Success)
                return false;

            // Hash and save new password
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);

            _unitOfWork.Repository<ApplicationUser>().Update(user);
            await _unitOfWork.CompleteAsync();

            return true;
        }

        public Task<UserDto> ToggleAdminRoleAsync(int userId, bool isAdmin)
        {
            throw new NotImplementedException();
        }
    }
}