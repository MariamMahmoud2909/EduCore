using ByWay.Core.Enums;

namespace ByWay.Core.DTOs.Common
{
    public class CourseFilterParams
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 12;
        public string? Search { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? CategoryId { get; set; }
        public CourseLevel? Level { get; set; }
    }
}
