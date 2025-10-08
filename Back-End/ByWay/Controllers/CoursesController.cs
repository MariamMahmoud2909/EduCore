using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.Course;
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
        [AllowAnonymous]
        public async Task<ActionResult<PagedResult<CourseDto>>> GetCourses(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] string? search = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] CourseLevel? level = null)
        {
            var filter = new CourseFilterParams
            {
                Page = page,
                PageSize = pageSize,
                Search = search,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                CategoryId = categoryId,
                Level = level
            };

            var result = await _courseService.GetCoursesAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CourseDto>> GetCourse(int id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            if (course == null)
                return NotFound();

            return Ok(course);
        }

        [HttpGet("TopCourses")]
        [AllowAnonymous]
        public async Task<ActionResult<List<CourseDto>>> GetTopCourses()
        {
            var courses = await _courseService.GetTopCoursesAsync();
            return Ok(courses);
        }

        [HttpGet("{id}/similar")]
        [AllowAnonymous]
        public async Task<ActionResult<List<CourseDto>>> GetSimilarCourses(int id)
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
        public async Task<ActionResult<CourseDto>> UpdateCourse(int id, CreateCourseDto courseDto)
        {
            var course = await _courseService.UpdateCourseAsync(id, courseDto);
            if (course == null)
                return NotFound();

            return Ok(course);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteCourse(int id)
        {
            var deleted = await _courseService.DeleteCourseAsync(id);
            if (!deleted)
                return BadRequest("Cannot delete course that has been purchased");

            return NoContent();
        }
    }
}
