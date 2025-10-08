using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Common;
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

        public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto dto)
        {
            var courses = await _unitOfWork.Repository<Course>().FindAsync(
                c => dto.CourseIds.Contains(c.Id)
            );

            if (courses.Count() != dto.CourseIds.Count)
                throw new InvalidOperationException("Some courses were not found");

            var order = new Order
            {
                UserId = userId,
                TotalAmount = courses.Sum(c => c.Price),
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Repository<Order>().AddAsync(order);
            await _unitOfWork.CompleteAsync();

            // Create order items
            foreach (var course in courses)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    CourseId = course.Id,
                    Price = course.Price
                };
                await _unitOfWork.Repository<OrderItem>().AddAsync(orderItem);
            }

            await _unitOfWork.CompleteAsync();

            return await GetOrderByIdAsync(order.Id) ?? throw new Exception("Failed to create order");
        }

        public async Task<CheckoutResultDto> CheckoutAsync(int userId, CheckoutDto dto)
        {
            try
            {
                //await _unitOfWork.BeginTransactionAsync();

                // Create order
                var courses = await _unitOfWork.Repository<Course>().FindAsync(
                    c => dto.CourseIds.Contains(c.Id)
                );

                var order = new Order
                {
                    UserId = userId,
                    TotalAmount = dto.TotalAmount,
                    Status = OrderStatus.Processing,
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Repository<Order>().AddAsync(order);
                await _unitOfWork.CompleteAsync();

                // Create order items
                foreach (var course in courses)
                {
                    await _unitOfWork.Repository<OrderItem>().AddAsync(new OrderItem
                    {
                        OrderId = order.Id,
                        CourseId = course.Id,
                        Price = course.Price
                    });
                }

                // Process payment
                var payment = new Payment
                {
                    OrderId = order.Id,
                    Amount = dto.TotalAmount,
                    Currency = dto.Currency,
                    Status = PaymentStatus.Processing,
                    PaymentMethod = dto.PaymentInfo.PaymentMethod,
                    TransactionId = Guid.NewGuid().ToString(),
                    CreatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Repository<Payment>().AddAsync(payment);

                // Simulate payment processing
                await Task.Delay(1000); // Simulate API call

                payment.Status = PaymentStatus.Succeeded;
                payment.ProcessedAt = DateTime.UtcNow;

                order.Status = OrderStatus.Completed;
                //order.CompletedAt = DateTime.UtcNow;

                // Enroll user in courses
                foreach (var courseId in dto.CourseIds)
                {
                    var existingEnrollments = await _unitOfWork.Repository<Enrollment>().FindAsync(
                        e => e.UserId == userId && e.CourseId == courseId
                    );

                    if (!existingEnrollments.Any())
                    {
                        await _unitOfWork.Repository<Enrollment>().AddAsync(new Enrollment
                        {
                            UserId = userId,
                            CourseId = courseId,
                            EnrolledAt = DateTime.UtcNow
                        });
                    }
                }

                // clear cart
                //var cartitems = await _unitofwork.repository<orderitem>().findasync(
                //    ci => ci.userid == userid
                //);
                //_unitofwork.repository<orderitem>().deleterange(cartitems);

                // Log activity
                await _unitOfWork.Repository<Activity>().AddAsync(new Activity
                {
                    Type = "OrderPlaced",
                    Description = $"Order #{order.Id} placed for ${dto.TotalAmount}",
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                });

                await _unitOfWork.CompleteAsync();
                await _unitOfWork.CompleteAsync();

                return new CheckoutResultDto
                {
                    OrderId = order.Id,
                    Success = true,
                    Message = "Payment successful!",
                    TransactionId = payment.TransactionId
                };
            }
            catch (Exception ex)
            {
                return new CheckoutResultDto
                {
                    Success = false,
                    Message = $"Payment failed: {ex.Message}"
                };
            }
        }

        public async Task<PagedResult<OrderDto>> GetAllOrdersAsync(int page, int pageSize)
        {
            var orders = await _unitOfWork.Repository<Order>().GetAllAsync(
                query => query
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Course)
                    .OrderByDescending(o => o.CreatedAt)
            );

            var totalCount = orders.Count();
            var pagedOrders = orders
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var orderDtos = _mapper.Map<List<OrderDto>>(pagedOrders);

            return new PagedResult<OrderDto>
            {
                Items = orderDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int orderId)
        {
            var orders = await _unitOfWork.Repository<Order>().FindAsync(
                o => o.Id == orderId,
                query => query
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Course)
            );

            var order = orders.FirstOrDefault();
            return order == null ? null : _mapper.Map<OrderDto>(order);
        }

        public async Task<List<OrderDto>> GetUserOrdersAsync(int userId)
        {
            var orders = await _unitOfWork.Repository<Order>().FindAsync(
                o => o.UserId == userId,
                query => query
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Course)
                    .OrderByDescending(o => o.CreatedAt)
            );

            return _mapper.Map<List<OrderDto>>(orders);
        }

        public async Task<OrderDto?> UpdateOrderStatusAsync(int orderId, OrderStatus status)
        {
            var orders = await _unitOfWork.Repository<Order>().FindAsync(o => o.Id == orderId);
            var order = orders.FirstOrDefault();

            if (order == null)
                return null;

            order.Status = status;

            //if (status == OrderStatus.Completed)
            //    order.CompletedAt = DateTime.UtcNow;

            _unitOfWork.Repository<Order>().Update(order);
            await _unitOfWork.CompleteAsync();

            return await GetOrderByIdAsync(orderId);
        }
    }
}