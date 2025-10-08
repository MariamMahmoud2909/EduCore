using ByWay.Application.Helpers;
using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.DTOs.Common;
using ByWay.Core.DTOs.InstructorDto;
using ByWay.Core.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ByWay.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructorsController : ControllerBase
    {
        private readonly IInstructorService _instructorService;

        public InstructorsController(IInstructorService instructorService)
        {
            _instructorService = instructorService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<InstructorDto>>> GetInstructors(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] JobTitle? jobTitle = null)
        {
            var filterParams = new InstructorFilterParams
            {
                Page = page,
                PageSize = pageSize,
                Search = search,
                JobTitle = jobTitle
            };

            var result = await _instructorService.GetInstructorsAsync(filterParams);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InstructorDto>> GetInstructor(int id)
        {
            var instructor = await _instructorService.GetInstructorByIdAsync(id);
            if (instructor == null)
                return NotFound();

            return Ok(instructor);
        }

        [HttpGet("top")]
        [AllowAnonymous]
        public async Task<ActionResult<List<InstructorDto>>> GetTopInstructors()
        {
            var instructors = await _instructorService.GetTopInstructorsAsync();
            return Ok(instructors);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<InstructorDto>> CreateInstructor(CreateInstructorDto instructorDto)
        {
            var instructor = await _instructorService.CreateInstructorAsync(instructorDto);
            return CreatedAtAction(nameof(GetInstructor), new { id = instructor.Id }, instructor);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<InstructorDto>> UpdateInstructor(int id, CreateInstructorDto instructorDto)
        {
            var instructor = await _instructorService.UpdateInstructorAsync(id, instructorDto);
            if (instructor == null)
                return NotFound();

            return Ok(instructor);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteInstructor(int id)
        {
            var deleted = await _instructorService.DeleteInstructorAsync(id);
            if (!deleted)
                return BadRequest("Cannot delete instructor with assigned courses");

            return NoContent();
        }
    }
}