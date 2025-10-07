using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.Review;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/courses/{courseId}/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<ReviewDto>>> GetCourseReviews(
            int courseId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var reviews = await _reviewService.GetCourseReviewsAsync(courseId, page, pageSize);
            return Ok(reviews);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> CreateReview(
            int courseId,
            CreateReviewDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            
            try
            {
                var review = await _reviewService.CreateReviewAsync(courseId, userId, dto);
                return CreatedAtAction(nameof(GetReviewById), 
                    new { courseId, reviewId = review.Id }, review);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{reviewId}")]
        public async Task<ActionResult<ReviewDto>> GetReviewById(int courseId, int reviewId)
        {
            var review = await _reviewService.GetReviewByIdAsync(reviewId);
            
            if (review == null || review.CourseId != courseId)
                return NotFound();

            return Ok(review);
        }

        [HttpPut("{reviewId}")]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> UpdateReview(
            int courseId,
            int reviewId,
            UpdateReviewDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            
            try
            {
                var review = await _reviewService.UpdateReviewAsync(reviewId, userId, dto);
                
                if (review == null)
                    return NotFound();

                return Ok(review);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
        }

        [HttpDelete("{reviewId}")]
        [Authorize]
        public async Task<ActionResult> DeleteReview(int courseId, int reviewId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var isAdmin = User.IsInRole("Admin");
            
            try
            {
                var deleted = await _reviewService.DeleteReviewAsync(reviewId, userId, isAdmin);
                
                if (!deleted)
                    return NotFound();

                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}