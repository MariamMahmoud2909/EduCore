using ByWay.Core.Contracts.Interfaces;
using ByWay.Core.Enums;

namespace ByWay.Core.Entities
{
    public class Instructor : BaseEntity, ITimestampEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Bio { get; set; }
        public string? Image { get; set; }
        public JobTitle JobTitle { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

        public string FullName => $"{FirstName} {LastName}";
        public int CoursesCount => Courses?.Count ?? 0;
        public string JobTitleName => JobTitle switch
        {
            JobTitle.FullstackDeveloper => "Fullstack Developer",
            JobTitle.BackendDeveloper => "Backend Developer",
            JobTitle.FrontendDeveloper => "Frontend Developer",
            JobTitle.UXUIDesigner => "UX/UI Designer",
            JobTitle.AiEngineer => "AI Engineer",
            _ => "Unknown"
        };
    }
}
