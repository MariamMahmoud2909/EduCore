using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.CourseDto;
using ByWay.Core.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<CourseDto>>> GetCourses(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] string? search = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] CourseLevel? level = null)
        {
            var result = await _courseService.GetCoursesAsync(page, pageSize, search, minPrice, maxPrice, categoryId, level);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(Guid id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            if (course == null)
                return NotFound();

            return Ok(course);
        }

        [HttpGet("top")]
        public async Task<ActionResult<List<CourseDto>>> GetTopCourses()
        {
            var courses = await _courseService.GetTopCoursesAsync();
            return Ok(courses);
        }

        [HttpGet("{id}/similar")]
        public async Task<ActionResult<List<CourseDto>>> GetSimilarCourses(Guid id)
        {
            var courses = await _courseService.GetSimilarCoursesAsync(id);
            return Ok(courses);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CourseDto>> CreateCourse(CreateCourseDto courseDto)
        {
            var course = await _courseService.CreateCourseAsync(courseDto);
            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CourseDto>> UpdateCourse(Guid id, CreateCourseDto courseDto)
        {
            var course = await _courseService.UpdateCourseAsync(id, courseDto);
            if (course == null)
                return NotFound();

            return Ok(course);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteCourse(Guid id)
        {
            var deleted = await _courseService.DeleteCourseAsync(id);
            if (!deleted)
                return BadRequest("Cannot delete course that has been purchased");

            return NoContent();
        }
    }
}
