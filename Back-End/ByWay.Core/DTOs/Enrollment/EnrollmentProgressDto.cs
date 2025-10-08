namespace ByWay.Core.DTOs.Enrollment
{
    public class EnrollmentProgressDto
    {
        public int EnrollmentId { get; set; }
        public int CourseId { get; set; }
        public string CourseTitle { get; set; }
        public int ProgressPercentage { get; set; }
        public int CompletedLessons { get; set; }
        public int TotalLessons { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? LastAccessedAt { get; set; }
        public TimeSpan TimeSpent { get; set; }
    }
}