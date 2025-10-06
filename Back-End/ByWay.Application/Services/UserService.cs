using AutoMapper;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.Contracts.Services;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.User;
using ByWay.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Application.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(UserManager<ApplicationUser> userManager, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResult<UserDto>> GetUsersAsync(UserFilterParams filterParams)
        {
            var usersQuery = _userManager.Users.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(filterParams.Search))
            {
                usersQuery = usersQuery.Where(u =>
                    u.FirstName.Contains(filterParams.Search) ||
                    u.LastName.Contains(filterParams.Search) ||
                    u.Email.Contains(filterParams.Search));
            }

            if (filterParams.IsAdmin.HasValue)
            {
                usersQuery = usersQuery.Where(u => u.IsAdmin == filterParams.IsAdmin.Value);
            }

            var totalCount = await usersQuery.CountAsync();

            var users = await usersQuery
                .OrderByDescending(u => u.CreatedAt)
                .Skip((filterParams.Page - 1) * filterParams.PageSize)
                .Take(filterParams.PageSize)
                .ToListAsync();

            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                var orders = await _unitOfWork.Repository<Order>().FindAsync(o => o.UserId == user.Id);
                var ordersList = orders.ToList();

                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email ?? "",
                    IsAdmin = user.IsAdmin,
                    CreatedAt = user.CreatedAt,
                    OrdersCount = ordersList.Count,
                    TotalSpent = ordersList.Sum(o => o.TotalAmount)
                });
            }

            return new PagedResult<UserDto>
            {
                Items = userDtos,
                TotalCount = totalCount,
                Page = filterParams.Page,
                PageSize = filterParams.PageSize
            };
        }

        public async Task<UserDto?> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            var orders = await _unitOfWork.Repository<Order>().FindAsync(o => o.UserId == userId);
            var ordersList = orders.ToList();

            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? "",
                IsAdmin = user.IsAdmin,
                CreatedAt = user.CreatedAt,
                OrdersCount = ordersList.Count,
                TotalSpent = ordersList.Sum(o => o.TotalAmount)
            };
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            // Don't allow deleting admin users
            if (user.IsAdmin) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> ToggleAdminRoleAsync(string userId, bool isAdmin)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            user.IsAdmin = isAdmin;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return false;

            // Update roles
            if (isAdmin)
            {
                if (!await _userManager.IsInRoleAsync(user, "Admin"))
                {
                    await _userManager.AddToRoleAsync(user, "Admin");
                }
            }
            else
            {
                if (await _userManager.IsInRoleAsync(user, "Admin"))
                {
                    await _userManager.RemoveFromRoleAsync(user, "Admin");
                }
            }

            return true;
        }

        public async Task<UserStatsDto> GetUserStatsAsync(string userId)
        {
            var orders = await _unitOfWork.Repository<Order>().FindAsync(o => o.UserId == userId);
            var ordersList = orders.ToList();

            var orderItems = new List<OrderItem>();
            foreach (var order in ordersList)
            {
                var items = await _unitOfWork.Repository<OrderItem>().FindAsync(oi => oi.OrderId == order.Id);
                orderItems.AddRange(items);
            }

            return new UserStatsDto
            {
                TotalOrders = ordersList.Count,
                TotalSpent = ordersList.Sum(o => o.TotalAmount),
                CoursesOwned = orderItems.Select(oi => oi.CourseId).Distinct().Count(),
                LastLogin = DateTime.UtcNow // Update this if you track last login
            };
        }
    }
}