using System.ComponentModel.DataAnnotations;

namespace ByWay.Core.DTOs.Review
{
    public class UpdateReviewDto
    {
        [Range(1, 5)]
        public int? Rating { get; set; }

        [StringLength(1000, MinimumLength = 10)]
        public string? Comment { get; set; }
    }
}