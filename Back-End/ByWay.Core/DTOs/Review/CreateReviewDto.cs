using System.ComponentModel.DataAnnotations;

namespace ByWay.Core.DTOs.Review
{
    public class CreateReviewDto
    {
        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 10)]
        public string Comment { get; set; }
    }
}