using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.Enrollment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EnrollmentsController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentsController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        [HttpPost]
        public async Task<ActionResult<EnrollmentDto>> EnrollCourse(EnrollCourseDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            try
            {
                var enrollment = await _enrollmentService.EnrollCourseAsync(userId, dto.CourseId);
                return Ok(enrollment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("my-courses")]
        public async Task<ActionResult<List<EnrollmentDto>>> GetMyEnrollments()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var enrollments = await _enrollmentService.GetUserEnrollmentsAsync(userId);
            return Ok(enrollments);
        }

        [HttpGet("{courseId}/progress")]
        public async Task<ActionResult<EnrollmentProgressDto>> GetEnrollmentProgress(int courseId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var progress = await _enrollmentService.GetEnrollmentProgressAsync(userId, courseId);

            if (progress == null)
                return NotFound();

            return Ok(progress);
        }

        [HttpPut("{courseId}/progress")]
        public async Task<ActionResult<EnrollmentProgressDto>> UpdateProgress(
            int courseId,
            UpdateProgressDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var progress = await _enrollmentService.UpdateProgressAsync(userId, courseId, dto);

            if (progress == null)
                return NotFound();

            return Ok(progress);
        }
    }
}