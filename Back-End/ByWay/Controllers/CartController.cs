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

        [HttpGet]
        public async Task<ActionResult<List<CourseDto>>> GetCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var cart = await _cartService.GetCartAsync(userId!);
            return Ok(cart);
        }

        [HttpPost]
        public async Task<ActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var success = await _cartService.AddToCartAsync(userId!, dto.CourseId);

            if (!success)
                return BadRequest("Course already in cart");

            return Ok();
        }

        [HttpDelete("{courseId}")]
        public async Task<ActionResult> RemoveFromCart(int courseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var success = await _cartService.RemoveFromCartAsync(userId!, courseId);

            if (!success)
                return NotFound();

            return Ok();
        }

        [HttpDelete]
        public async Task<ActionResult> ClearCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _cartService.ClearCartAsync(userId!);
            return Ok();
        }
    }
}
