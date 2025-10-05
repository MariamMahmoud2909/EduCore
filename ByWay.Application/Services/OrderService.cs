using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Order;
using ByWay.Core.Entities;
using ByWay.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICartService _cartService;
        private readonly IEmailService _emailService;

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper, ICartService cartService, IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cartService = cartService;
            _emailService = emailService;
        }

        public async Task<OrderDto> CheckoutAsync(CheckoutDto checkoutDto, string userId)
        {
            // Get courses from cart
            var cartCourses = await _cartService.GetCartAsync(userId);

            if (!cartCourses.Any())
                throw new InvalidOperationException("Cart is empty");

            // Create order
            var order = new Order
            {
                UserId = userId,
                TotalAmount = checkoutDto.TotalAmount,
                TaxAmount = checkoutDto.TaxAmount,
                PaymentMethod = checkoutDto.PaymentMethod,
                BillingFirstName = checkoutDto.FirstName,
                BillingLastName = checkoutDto.LastName,
                BillingEmail = checkoutDto.Email,
                BillingAddress = checkoutDto.Address,
                BillingCity = checkoutDto.City,
                BillingZipCode = checkoutDto.ZipCode,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Completed
            };

            await _unitOfWork.Repository<Order>().AddAsync(order);

            // Create order items
            foreach (var course in cartCourses)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    CourseId = course.Id,
                    Price = course.Price,
                    PurchasedAt = DateTime.UtcNow
                };

                await _unitOfWork.Repository<OrderItem>().AddAsync(orderItem);

                // Mark course as purchased
                var courses = await _unitOfWork.Repository<Course>().FindAsync(c => c.Id == course.Id);
                var courseEntity = courses.FirstOrDefault();
                if (courseEntity != null)
                {
                    courseEntity.IsPurchased = true;
                    _unitOfWork.Repository<Course>().Update(courseEntity);
                }
            }

            await _unitOfWork.CompleteAsync();

            // Clear cart
            await _cartService.ClearCartAsync(userId);

            // Send confirmation email
            var courseNames = cartCourses.Select(c => c.Title).ToList();
            await _emailService.SendPurchaseConfirmationEmailAsync(checkoutDto.Email, checkoutDto.FirstName, courseNames);

            var orderDto = _mapper.Map<OrderDto>(order);
            orderDto.Courses = cartCourses;
            return orderDto;
        }

        public async Task<List<OrderDto>> GetUserOrdersAsync(string userId)
        {
            var orders = await _unitOfWork.Repository<Order>().FindAsync(
                o => o.UserId == userId,
                query => query.Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Course)
                    .OrderByDescending(o => o.OrderDate)
            );

            return _mapper.Map<List<OrderDto>>(orders.ToList());
        }
    }
}
