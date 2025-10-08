using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Course;
using ByWay.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Application.Services
{
    public class CartService : ICartService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CartService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<CourseDto>> GetCartAsync(int userId)
        {
            var cartItems = await _unitOfWork.Repository<Cart>().FindAsync(
                sc => sc.UserId == userId,
                query => query
                    .Include(sc => sc.Course)
                        .ThenInclude(c => c.Category)
                    .Include(sc => sc.Course)
                        .ThenInclude(c => c.Instructor)
            );

            var courses = cartItems.Select(ci => ci.Course).ToList();
            return _mapper.Map<List<CourseDto>>(courses);
        }

        public async Task<bool> AddToCartAsync(int userId, int courseId)
        {
            // Check if already in cart
            var existingItem = await _unitOfWork.Repository<Cart>().AnyAsync(
                sc => sc.UserId == userId && sc.CourseId == courseId
            );

            if (existingItem)
                return false;

            var cartItem = new Cart
            {
                UserId = userId,
                CourseId = courseId,
                AddedAt = DateTime.UtcNow
            };

            await _unitOfWork.Repository<Cart>().AddAsync(cartItem);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> RemoveFromCartAsync(int userId, int courseId)
        {
            var cartItems = await _unitOfWork.Repository<Cart>().FindAsync(
                sc => sc.UserId == userId && sc.CourseId == courseId
            );

            var cartItem = cartItems.FirstOrDefault();
            if (cartItem == null)
                return false;

            _unitOfWork.Repository<Cart>().Delete(cartItem);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var cartItems = await _unitOfWork.Repository<Cart>().FindAsync(
                sc => sc.UserId == userId
            );

            foreach (var item in cartItems)
            {
                _unitOfWork.Repository<Cart>().Delete(item);
            }

            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
