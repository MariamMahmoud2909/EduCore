using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("process")]
        public async Task<ActionResult<PaymentResultDto>> ProcessPayment(ProcessPaymentDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            try
            {
                var result = await _paymentService.ProcessPaymentAsync(userId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("methods")]
        public async Task<ActionResult<List<PaymentMethodDto>>> GetPaymentMethods()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var methods = await _paymentService.GetUserPaymentMethodsAsync(userId);
            return Ok(methods);
        }

        [HttpPost("methods")]
        public async Task<ActionResult<PaymentMethodDto>> SavePaymentMethod(SavePaymentMethodDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var method = await _paymentService.SavePaymentMethodAsync(userId, dto);
            return Ok(method);
        }

        [HttpDelete("methods/{methodId}")]
        public async Task<ActionResult> DeletePaymentMethod(int methodId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var deleted = await _paymentService.DeletePaymentMethodAsync(userId, methodId);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}