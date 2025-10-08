using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.Course;
using ByWay.Core.DTOs.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private int GetUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdString, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID");
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<List<CourseDto>>> GetCart()
        {
            var userId = GetUserId();
            var cart = await _cartService.GetCartAsync(userId!);
            return Ok(cart);
        }

        [HttpPost]
        public async Task<ActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            var userId = GetUserId();
            var success = await _cartService.AddToCartAsync(userId!, dto.CourseId);

            if (!success)
                return BadRequest("Course already in cart");

            return Ok();
        }

        [HttpDelete("{courseId}")]
        public async Task<ActionResult> RemoveFromCart(int courseId)
        {
            var userId = GetUserId();
            var success = await _cartService.RemoveFromCartAsync(userId!, courseId);

            if (!success)
                return NotFound();

            return Ok();
        }

        [HttpDelete]
        public async Task<ActionResult> ClearCart()
        {
            var userId = GetUserId();
            await _cartService.ClearCartAsync(userId!);
            return Ok();
        }
    }
}
