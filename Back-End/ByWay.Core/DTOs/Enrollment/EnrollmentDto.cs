namespace ByWay.Core.DTOs.Enrollment
{
    public class EnrollmentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public string CourseTitle { get; set; }
        public string CourseImageUrl { get; set; }
        public string InstructorName { get; set; }
        public int ProgressPercentage { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime EnrolledAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? LastAccessedAt { get; set; }
    }
}