using AutoMapper;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Contracts.Repositories;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.Review;
using ByWay.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ByWay.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ReviewService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResult<ReviewDto>> GetCourseReviewsAsync(int courseId, int page = 1, int pageSize = 10)
        {
            var reviews = await _unitOfWork.Repository<Review>().GetAllAsync(
                query => query
                    .Include(r => r.User)
                    .Where(r => r.CourseId == courseId)
                    .OrderByDescending(r => r.CreatedAt)
            );

            var totalCount = reviews.Count();
            var pagedReviews = reviews
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            
            var reviewDtos = _mapper.Map<List<ReviewDto>>(pagedReviews);

            return new PagedResult<ReviewDto>
            {
                Items = reviewDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<ReviewDto?> GetReviewByIdAsync(int reviewId)
        {
            var reviews = await _unitOfWork.Repository<Review>().FindAsync(
                r => r.Id == reviewId,
                query => query.Include(r => r.User)
            );

            var review = reviews.FirstOrDefault();
            return review == null ? null : _mapper.Map<ReviewDto>(review);
        }

        public async Task<ReviewDto> CreateReviewAsync(int courseId, int userId, CreateReviewDto dto)
        {
            // Check if course exists
            var courses = await _unitOfWork.Repository<Course>().FindAsync(c => c.Id == courseId);
            if (!courses.Any())
                throw new InvalidOperationException("Course not found");

            // Check if user has already reviewed
            var existingReviews = await _unitOfWork.Repository<Review>().FindAsync(
                r => r.CourseId == courseId && r.UserId == userId
            );

            if (existingReviews.Any())
                throw new InvalidOperationException("You have already reviewed this course");

            var review = _mapper.Map<Review>(dto);
            review.CourseId = courseId;
            review.UserId = userId;
            review.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.Repository<Review>().AddAsync(review);
            await _unitOfWork.CompleteAsync();

            // Update course rating
            await UpdateCourseRatingAsync(courseId);

            return await GetReviewByIdAsync(review.Id) ?? throw new Exception("Failed to create review");
        }

        public async Task<ReviewDto?> UpdateReviewAsync(int reviewId, int userId, UpdateReviewDto dto)
        {
            var reviews = await _unitOfWork.Repository<Review>().FindAsync(r => r.Id == reviewId);
            var review = reviews.FirstOrDefault();

            if (review == null) return null;
            if (review.UserId != userId)
                throw new UnauthorizedAccessException("You can only update your own reviews");

            if (dto.Rating.HasValue)
                review.Rating = dto.Rating.Value;

            if (!string.IsNullOrWhiteSpace(dto.Comment))
                review.Comment = dto.Comment;

            review.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Repository<Review>().Update(review);
            await _unitOfWork.CompleteAsync();

            // Update course rating
            await UpdateCourseRatingAsync(review.CourseId);

            return await GetReviewByIdAsync(reviewId);
        }

        public async Task<bool> DeleteReviewAsync(int reviewId, int userId, bool isAdmin = false)
        {
            var reviews = await _unitOfWork.Repository<Review>().FindAsync(r => r.Id == reviewId);
            var review = reviews.FirstOrDefault();

            if (review == null) return false;

            if (!isAdmin && review.UserId != userId)
                throw new UnauthorizedAccessException("You can only delete your own reviews");

            var courseId = review.CourseId;
            _unitOfWork.Repository<Review>().Delete(review);
            await _unitOfWork.CompleteAsync();

            // Update course rating
            await UpdateCourseRatingAsync(courseId);

            return true;
        }

        public async Task<bool> UserHasReviewedCourseAsync(int courseId, int userId)
        {
            var reviews = await _unitOfWork.Repository<Review>().FindAsync(
                r => r.CourseId == courseId && r.UserId == userId
            );
            return reviews.Any();
        }

        private async Task UpdateCourseRatingAsync(int courseId)
        {
            var courses = await _unitOfWork.Repository<Course>().FindAsync(
                c => c.Id == courseId,
                query => query.Include(c => c.Reviews)
            );
            var course = courses.FirstOrDefault();

            if (course == null) return;

            course.ReviewsCount = course.Reviews.Count;
            course.AverageRating = course.Reviews.Any()
                ? (decimal)course.Reviews.Average(r => r.Rating)
                : 0;

            _unitOfWork.Repository<Course>().Update(course);
            await _unitOfWork.CompleteAsync();
        }
    }
}