using System.ComponentModel.DataAnnotations;

namespace ByWay.Core.DTOs.Enrollment
{
    public class UpdateProgressDto
    {
        [Range(0, 100)]
        public int ProgressPercentage { get; set; }

        public int? CompletedLessons { get; set; }

        public bool? IsCompleted { get; set; }
    }
}