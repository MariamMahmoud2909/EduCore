using ByWay.Core.Enums;

namespace ByWay.Core.DTOs.InstructorDto
{
    public class CreateInstructorDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Bio { get; set; }
        public string? Image { get; set; }
        public JobTitle JobTitle { get; set; }
    }
}
